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
            <div id="play-menu" className="centered menu-column menu">
                <div id="play-menu-top">
                    <div id="username-input-container" className="menu-item">
                        <input type="text" id="username-input" className="inputFormat" placeholder="Choose a Username" />
                    </div>
                    <div id="play-button-containter" className="menu-item">
                        <button id="play-button" className="buttonFormat">Play against a random opponent</button>
                    </div>
                    <div id="lobby-button-container" className="menu-item">
                        <button id="lobby-button" className="buttonFormat">Create a lobby</button>
                    </div>

                    <div id="join-button-container" className="menu-item">
                        <button id="join-button" className="buttonFormat">Join a lobby</button>
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
            <div id="make-lobby-container" className="none centered menu">
                <div id="lobby-instructions-container" className="menu-item">
                    Send this code to your friend. They can click on Join Lobby
                    in the main menu to join your game.
                </div>
                <div id="lobby-code-container" className="centered codeFormat menu-item">
                    {/* Putt generated lobby code here */}
                </div>
                <div id="lobby-return-container" className="menu-item">
                    {/* Need either an a tag or button */}
                    <button id="make-lobby-close-button" className="buttonFormat">Return to Main Menu</button>
                </div>
            </div>
        )
    }
}

class JoinLobby extends React.Component{
    render(){
        return(
            <div id="join-lobby-container" className="none centered menu">
                <div id="join-instructions-container" className="menu-item">
                    If you have a code from a friend. Enter it here and press
                    join game. Once they hit join, the game will start.
                </div>
                <div id="join-code-container" className="centered menu-item">
                    <input type="text" id="lobby-input" className="inputFormat" placeholder="Put lobby code here"/>
                </div>
                <div id="join-message-container" className="menu-item"></div>
                <div id="join-start-container" className="menu-item">
                    <button id="join-lobby-start-button" className="buttonFormat">Join Game</button>
                </div>
                <div id="join-return-container" className="menu-item">
                    <button id="join-lobby-close-button" className="buttonFormat">Return to Main Menu</button>
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
