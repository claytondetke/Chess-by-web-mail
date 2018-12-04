import React, { Component } from 'react';
import './App.css';
import LoaderButton from "./components/LoaderButton";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: window.parent.username,
            isLoading: false,
            isValidMove: false,
            gameName: "",
            gameInfo: JSON.parse(window.parent.game_data),
            gameID: window.parent.game_id,
            blackUser: "",
            bPresent: true,
            whiteUser: "",
            wPresent: true,
            boardState: "",
            gameState: ""
        };
    }

    // returns "black" "white" or "error"
    getColor(){
        if(this.state.userName === this.state.blackUser){
            return "black";
        }else if(this.state.userName === this.state.whiteUser){
            return "white";
        }else{
            return "error";
        }
    }

    async componentDidMount() {
        // {"name": "1v1 fite me", "black_user": "user", "black_present": true, "white_user":
        // "abc123", "white_present": true, "board_state": "RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr",
        // "game_state": "TW"}
        try {
            console.log(this.state.gameInfo);
            this.setState({
                gameName: this.state.gameInfo.name,
                blackUser: this.state.gameInfo.black_user,
                whiteUser: this.state.gameInfo.white_user,
                bPresent: this.state.gameInfo.black_present,
                wPresent: this.state.gameInfo.white_present,
                boardState: this.state.gameInfo.board_state,
                gameState: this.state.gameInfo.game_state
            });
            console.log(this.state.gameInfo);
            this.setState({isLoading: false});
        }catch(e){
            alert(e);
        }
        console.log(this.state.boardState);
        return true;
    }

    gameStateMessage(gs, col){
        if(gs === "ED"){
            return "IT'S A DRAW!";
        }else if((gs === "EW" && col === "white") || (gs === "EB" && col === "black")){
            return "YOU WIN!";
        }else if((gs === "EB" && col === "white") || (gs === "EW" && col === "black")) {
            return "YOU LOSE!";
        }else if((gs === "TW" && col === "white") || (gs === "TB" && col === "black")) {
            return "It is your turn.";
        }else if((gs === "TB" && col === "white") || (gs === "TW" && col === "black")){
            return "It is not your turn.";
        }else{
            return "ERROR!!!!!!";
        }
    }

    isMyTurn(){
        if(this.state.userName === this.state.blackUser){
            if(this.state.gameState === "TB"){
                return this.state.isValidMove;
            }else{ return false; }
        }else if(this.state.userName === this.state.whiteUser){
            if(this.state.gameState === "TW"){
                return this.state.isValidMove;
            }else{ return false; }
        }else{
            console.log("Error, invalid user for this game.")
            return false;
        }
    }

    validateForm() {
        return this.state.isValidMove && this.isMyTurn();
    }
    handleSendMove = async event => {
        const confirmed = window.confirm(
            "Are you sure you want to send this move?"
        );
        if (!confirmed) { return; }
        this.setState({ isLoading: true });
        try {
            this.sendMove();
            window.parent.location = "/inbox";
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    sendMove() {
        let url = "/game/"+this.state.gameID+"/move";
        console.log(url);
        let data = {
            board_state: this.state.boardState,
            game_state: this.state.gameState
        };
        let outputData = JSON.stringify(data);
        console.log(outputData);
        return fetch(url, {
            method: "POST",
            body: outputData
        })
            .then(response => response.json())
            .then(response => console.log(response));
    }

    handleQuit = async event => {
        const confirmed = window.confirm(
            "Are you sure you want to send this move?"
        );
        if (!confirmed) { return; }
        this.setState({ isLoading: true });
        try {
            this.quitGame();
            window.parent.location = "/inbox";
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    quitGame() {
        let url = "/game/"+this.state.gameID+"/quit";
        console.log(url);
        return fetch(url, {
            method: "POST",
        })
    }


    render() {
        return (
            <div className="App">
                <div>
                    {(this.getColor() === "black")
                        ?
                        <div>
                            <div className="players">
                                <h2>{"Black: "+this.state.blackUser}</h2>
                            </div>
                            <div className="players">
                                <h1>{this.gameStateMessage(this.state.gameState, this.getColor())}</h1>
                            </div>
                            <div className="players">
                                <h2>{"White: "+this.state.whiteUser}</h2>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="players">
                                <h2>{"White: "+this.state.whiteUser}</h2>
                            </div>
                            <div className="players">
                                <h1>{this.gameStateMessage(this.state.gameState, this.getColor())}</h1>
                            </div>
                            <div className="players">
                                <h2>{"Black: "+this.state.blackUser}</h2>
                            </div>
                        </div>
                    }
                </div>
                <div className="buttons">
                    <form onSubmit={this.handleSendMove}>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Send Move"
                            loadingText="Sending…"
                            className="but"
                        />
                    </form>
                </div>
                <div className="buttons">
                    <form onSubmit={this.handleQuit}>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={false}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Quit game"
                            loadingText="Quitting…"
                            className="but"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
