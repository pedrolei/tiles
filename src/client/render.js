import React from 'react';
import { joinLobby } from './networking';


export default class Main extends React.Component{
    render(){
        return(
            <div id='main'>
                <div id="main-container">
                    {/* <Login/> */}
                    <Logo/>
                    <PlayMenu/>
                    <MakeLobby/>
                    <JoinLobby/>
                    <Canvas/>
                </div>
                <Signature/>
            </div>
        );
    }
}

class PlayMenu extends React.Component {
    render() {
      return (
        <div id="play-menu-container">
            <div id="play-menu" className="centered menu-column">
                <div id="play-menu-top">
                    <div id="username-input-container" className="">
                        <input type="text" id="username-input" placeholder="Choose a Username" />
                    </div>
                    <div id="play-button-containter">
                        <button id="play-button">Play against a random opponent</button>
                    </div>
                </div>

                <div id="play-menu-bottom" className="menu-row">
                    <div id="left-column" className="">
                        <div id="lobby-button-container">
                            <button id="lobby-button">Create a lobby</button>
                        </div>
                    </div>

                    <div id ="right-column" className="">
                        {/* <div id="lobby-code-container" className="none">
                            <div id="lobby-code"></div>
                        </div> */}
                        
                        <div id="join-button-container">
                            <button id="join-button">Join a lobby</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        );
    }
}

class MakeLobby extends React.Component{
    render(){
        return(
            <div id="make-lobby-container" className="none centered">
                <div id="lobby-instructions-container">
                    Send this code to your friend. They can click on Join Lobby
                    in the main menu to join your game.
                </div>
                <div id="lobby-code-container">
                    {/* Putt generated lobby code here */}
                </div>
                <div id="lobby-return-container">
                    {/* Need either an a tag or button */}
                    <button id="lobby-close-button">Return to Main Menu</button>
                </div>
            </div>
        )
    }
}

class JoinLobby extends React.Component{
    render(){
        return(
            <div id="join-lobby-container" className="none centered">
                <div id="join-instructions-container">
                    If you have a code from a friend. Enter it here and press
                    join game. Once they hit join, the game will start.
                </div>
                <div id="join-code-container" className="centered">
                    <input type="text" id="lobby-input" placeholder="Put lobby code here"/>
                </div>
                <div id="join-message-container"></div>
                <div id="join-start-container">
                    <button id="join-lobby-start-button">Join Game</button>
                </div>
                <div id="join-return-container">
                    <button id="join-lobby-close-button">Return to Main Menu</button>
                </div>
                    
            </div>
        )
    }
}

class Logo extends React.Component{
    render(){
        return (
            <div id="logo-container">
                Pedro's Puzzle Panic!
            </div>
        )
    }
}

class Login extends React.Component{
    render(){
        return (
            <div id="login-container">
                <a id="login-button">Login/Sign Up</a>
            </div>
        )
    }
}
 
class Canvas extends React.Component {
    render() {
      return (
        <div id="canvas-container" className="none">
            <canvas id="GameCanvas" width="1280" height="500"></canvas>
        </div>
        );
    }
}

class Signature extends React.Component {
    render(){
        return (
            <div id="signature-container">
                <div id="signature">A game by Pedro Leiva</div>
            </div>
        )
    }
}
