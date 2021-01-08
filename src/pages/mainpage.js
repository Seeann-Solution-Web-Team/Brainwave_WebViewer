import React from 'react'
import './mainpage.css'

class MainPage extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        
    }

    render(){
        return (
            <div>
                <div>
                    <div>
                        Logo
                    </div>
                </div>
                <div class='nemuButtons'>
                    <div class='nemuCol'>
                        <button class='menuButton'>a</button>
                        <button class='menuButton'>b</button>
                    </div>
                    <div class='nemuCol'>
                        <button class='menuButton'>c</button>
                        <button class='menuButton'>d</button>
                    </div>
                </div>
            </div>);
    }
}

export default MainPage;