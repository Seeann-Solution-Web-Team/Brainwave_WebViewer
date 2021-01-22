class RHSFile {
  constructor() {
    this.dataView = null;
    this.isInitialized = false;
    this.filePos = -1;
    this.onProgress = this.onProgress.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
  }

  load(fileId, onLoadedCallback, onProgressCallback) {
    console.log('loading ' + fileId);

    //Test
    this.request = new XMLHttpRequest();
    this.request.open('GET', 'api/viewer/fileId/' + fileId, true);
    this.request.responseType = 'arraybuffer';
    this.request.onprogress = this.onProgress;
    this.request.onload = this.onLoad;
    this.request.onerror = this.onError;
    this.request.overrideMimeType('text/plain; charset=x-user-defined');
    this.request.send(null);

    this.id = fileId;
    this.onLoadedCallback = onLoadedCallback;
    this.onProgressCallback = onProgressCallback;
  }

  //#####Events#####
  onProgress(e) {
    var percentage = (e.loaded / e.total) * 100;
    //console.log(e.loaded + ' / ' + e.total + " (" + percentage + '%)');

    if (this.onProgressCallback !== undefined)
      this.onProgressCallback(this, percentage);
  }

  onLoad(e) {
    if (this.request.readyState === 4) {
      if (this.request.status === 200 || this.request.status === 0) {
        this.dataView = new DataView(this.request.response);
        this.dataLength = this.dataView.byteLength;
        this.filePos = 0;
        console.log('file loaded successfully');
        this.parse();

        if (this.onLoadedCallback !== undefined) this.onLoadedCallback(this);
      }
    } else {
      alert('Failed to read file');
    }
  }

  onError(e) {
    console.log('Error : ' + this.request.statusText);
  }

  parse() {
    //Validate Magin-number
    var magicNum = [0xd6, 0x91, 0x27, 0xac];
    var nmValues = this.getBytes(4);
    var i = 0;
    var j = 0;

    for (i = 0; i < nmValues.length; i++) {
      if (magicNum[i] !== nmValues[i]) {
        console.log('Wrong magic number detected');
        return;
      }
    }
    console.log('Magic number found');

    //==Load header==
    this.version = this.getInt16();
    this.secondaryVersion = this.getInt16();
    this.sampleRate = this.getSingle();

    this.DSPEnabled = this.getInt16();

    this.actialDSPCutoffFrequency = this.getSingle();
    this.actualLowerBandwidth = this.getSingle();
    this.actualLowerSettleBandwidth = this.getSingle();
    this.actualUpperBandwidth = this.getSingle();

    this.desiredDSPCutoffFrequency = this.getSingle();
    this.desiredLowerBandwidth = this.getSingle();
    this.desiredLowerSettleBandwidth = this.getSingle();
    this.desiredUpperBandwidth = this.getSingle();

    this.notchFilterMode = this.getInt16();
    this.desiredImpedanceTestFrequency = this.getSingle();
    this.actualImpedanceTestFrequency = this.getSingle();

    this.ampSettleMode = this.getInt16();
    this.cahrgeRecoveryMode = this.getInt16();

    this.stimStepSize = this.getSingle();
    this.chargeRecoveryCurrentLimit = this.getSingle();
    this.chargeRecoveryTargetVoltage = this.getSingle();

    this.note1 = this.getQString();
    this.note2 = this.getQString();
    this.note3 = this.getQString();

    this.DCAmplifierDataSaved = this.getInt16();
    this.boardName = this.getInt16();

    this.referenceChannelName = this.getQString();
    this.signalGroupCount = this.getInt16();

    console.log('version: ' + this.version);
    console.log('sample rate: ' + this.sampleRate);
    console.log('DSP Enabled: ' + this.DSPEnabled);

    //==Read signal group and channel descriptions==
    this.signalGroups = [];

    var ampCount = 0;
    var adcCount = 0;
    var dacCount = 0;
    var digInCount = 0;
    var digOutCount = 0;

    for (i = 0; i < this.signalGroupCount; i++) {
      //Push new signal group
      this.signalGroups.push({
        name: this.getQString(),
        prefix: this.getQString(),
        enabled: this.getInt16(),
        channelCount: this.getInt16(),
        amplifierChannelCount: this.getInt16(),
        channels: [],
      });

      //read channel descriptions
      var count = this.signalGroups[i].channelCount;
      for (j = 0; j < count; j++) {
        this.signalGroups[i].channels.push({
          nativeName: this.getQString(),
          customName: this.getQString(),
          nativeOrder: this.getInt16(),
          customOrder: this.getInt16(),
          signalType: this.getInt16(),
          enabled: this.getInt16(),
          chipChannel: this.getInt16(),
          commandStream: this.getInt16(),
          boardStream: this.getInt16(),
          spikeScopeVoltageTriggerMode: this.getInt16(),
          spikeScopeVoltageThreshold: this.getInt16(),
          spikeScopeDigitalTriggerChannel: this.getInt16(),
          spikeScopeDigitalEdgePolarity: this.getInt16(),
          electrodeImpedanceMagnitude: this.getSingle(),
          electrodeImpedancePhase: this.getSingle(),
        });

        if (this.signalGroups[i].channels[j].enabled) {
          var type = this.signalGroups[i].channels[j].signalType;

          if (type === 0) ampCount++;
          else if (type === 3) adcCount++;
          else if (type === 4) dacCount++;
          else if (type === 5) digInCount++;
          else if (type === 6) digOutCount++;
        }
      }
    }

    console.log('amplifier channels: ' + ampCount);
    console.log('ADC channels: ' + adcCount);
    console.log('DAC channels: ' + dacCount);
    console.log('Digital Input channels: ' + digInCount);
    console.log('Digital Output channels: ' + digOutCount);

    //==Read Data Blocks==
    var blockSize = this.getDataBlockSize(
      this.DCAmplifierDataSaved === 1,
      ampCount,
      adcCount,
      dacCount,
      digInCount,
      digOutCount
    );
    var blockCount = Math.floor((this.dataLength - this.filePos) / blockSize);

    console.log(
      'Data Block Size : ' + blockSize + ', Data Block Count : ' + blockCount
    );

    var timestamps = [];
    var ampData = [];
    var dcAmpData = [];
    var stimData = [];
    var adcData = [];
    var dacData = [];
    var digInData = [];
    var digOutData = [];

    for (i = 0; i < ampCount; i++) ampData.push([]);
    for (i = 0; i < ampCount; i++) dcAmpData.push([]);
    for (i = 0; i < ampCount; i++) stimData.push([]);
    for (i = 0; i < adcCount; i++) adcData.push([]);
    for (i = 0; i < dacCount; i++) dacData.push([]);

    var k = 0;
    for (i = 0; i < blockCount; i++) {
      //Read one Data Block
      //Timestamps
      for (j = 0; j < 128; j++) {
        timestamps.push(this.getInt32());
      }

      //Amplifier
      if (ampCount > 0) {
        for (j = 0; j < ampCount; j++) {
          for (k = 0; k < 128; k++) {
            ampData[j].push(this.getInt16());
          }
        }

        if (this.DCAmplifierDataSaved === 1) {
          for (j = 0; j < ampCount; j++) {
            for (k = 0; k < 128; k++) {
              dcAmpData[j].push(this.getInt16());
            }
          }
        }

        for (j = 0; j < ampCount; j++) {
          for (k = 0; k < 128; k++) {
            stimData[j].push(this.getInt16());
          }
        }
      }

      //ADC
      for (j = 0; j < adcCount; j++) {
        for (k = 0; k < 128; k++) {
          adcData[j].push(this.getInt16());
        }
      }

      //DAC
      for (j = 0; j < dacCount; j++) {
        for (k = 0; k < 128; k++) {
          dacData[j].push(this.getInt16());
        }
      }

      //Board digital input
      if (digInCount > 0) {
        for (j = 0; j < 128; j++) {
          digInData.push(this.getInt16());
        }
      }

      //Board digital output
      if (digOutCount > 0) {
        for (j = 0; j < 128; j++) {
          digOutData.push(this.getInt16());
        }
      }
    }

    this.timestamps = timestamps;
    this.ampData = ampData;
    this.dcAmpData = dcAmpData;
    this.stimData = stimData;
    this.adcData = adcData;
    this.dacData = dacData;
    this.digInData = digInData;
    this.digOutData = digOutData;

    this.recordLength = Math.round((blockCount * 128) / this.sampleRate);
    console.log('record length is ' + this.recordLength + 'seconds');

    this.isInitialized = true;
    console.log('rhs file is loaded successfully');
  }

  //#####Get data functions#####
  //little-endian
  getBytes(count) {
    var array = [];
    for (var i = count - 1; i > -1; i--) {
      array.push(this.dataView.getUint8(this.filePos + i));
    }

    this.filePos += count;
    return array;
  }

  getUint16() {
    this.filePos += 2;
    return this.dataView.getUint16(this.filePos - 2, true);
  }

  getInt16() {
    this.filePos += 2;
    return this.dataView.getInt16(this.filePos - 2, true);
  }

  getUint32() {
    this.filePos += 4;
    return this.dataView.getUint32(this.filePos - 4, true);
  }

  getInt32() {
    this.filePos += 4;
    return this.dataView.getInt32(this.filePos - 4, true);
  }

  getSingle() {
    this.filePos += 4;
    return this.dataView.getFloat32(this.filePos - 4, true);
  }

  getDouble() {
    this.filePos += 8;
    return this.dataView.getFloat64(this.filePos - 8, true);
  }

  getQString() {
    var length = this.dataView.getUint32(this.filePos, true);
    this.filePos += 4;
    if (length < 1) return '';

    var arr = [];
    length = length / 2;

    for (var i = 0; i < length; i++) {
      arr = arr.concat(this.getBytes(2));
    }

    var buffer = new Uint8Array(arr);
    return new TextDecoder('utf-16be').decode(buffer);
  }

  getDataBlockSize(
    isDcAmpSaved,
    ampCount,
    adcCount,
    dacCount,
    digInCount,
    digOutCount
  ) {
    var N = 128;
    var size = N * 4; //timestamp

    size += N * 2 * ampCount;

    if (isDcAmpSaved) size += N * 2 * ampCount;

    size += N * 2 * ampCount;
    size += N * 2 * adcCount;
    size += N * 2 * dacCount;

    if (digInCount > 0) size += N * 2;
    if (digOutCount > 0) size += N * 2;

    return size;
  }

  getNormalizedAmpData() {
    var nor = [];

    for (var i = 0; i < this.ampData.length; i++) {
      var max = this.max(this.ampData[i]);
      var min = this.min(this.ampData[i]);
      var mmax = Math.max(max, Math.abs(min));

      nor.push([]);
      for (var j = 0; j < this.timestamps.length; j++) {
        nor[i].push(this.ampData[i][j] / mmax);
      }
    }

    return nor;
  }

  getChannelData() {
    var arr = [];
    var i = 0;
    var j = 0;

    for (i = 0; i < this.signalGroups.length; i++) {
      for (j = 0; j < this.signalGroups[i].channels.length; j++) {
        if (this.signalGroups[i].channels[j].signalType === 0) {
          arr.push(this.signalGroups[i].channels[j]);
        }
      }
    }

    return arr;
  }

  max(arr) {
    var m = -100000;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > m) m = arr[i];
    }

    return m;
  }

  min(arr) {
    var m = 100000;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] < m) m = arr[i];
    }

    return m;
  }
}

export default RHSFile;
