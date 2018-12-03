import React, { Component } from 'react';
import './App.css';
import LoaderButton from "./components/LoaderButton";

function parseBoardState(boardState) {
    let board = [[],[]]
    for(let y=0; y<8; y++){
        for(let x=0; x<8; x++){
            board[x][y].push(boardState[(y*8)+x]);
        }
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isValidMove: false,
            gameInfo: [],
            gameID: -1,
            BUID: -1,
            bPresent: true,
            WUID: -1,
            wPresent: true,
            boardState: [[],[]],
            validMoves: [[],[]],
            gameState: 0
        };
    }

    async componentDidMount() {
        /*return fetch()
            .then(response => response.json())
            .then(responseJson => this.setState({
                gameInfo: responseJson
            }))
            .then(() => this.setState({
                gameID: this.state.gameInfo.id,
                BUID: this.state.gameInfo.blackUserID,
                WUID: this.state.gameInfo.whiteUserID,
                bPresent: this.state.gameInfo.blackUserPresent,
                wPresent: this.state.gameInfo.whiteUserPresent,
                boardState: parseBoardState(this.state.gameInfo.boardState),
                gameState: this.state.gameInfo.gameState
            }))
            .then(() => console.log(this.state.gameInfo))
            .then(() => this.setState({isLoading: false}));
        */
        return true;
    }

    validateForm() {
        return this.state.isValidMove;
    }

    handleSubmit = async event => {
        const confirmed = window.confirm(
            "Are you sure you want to send this move?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isLoading: true });

        try {
            await this.sendMove();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    sendMove() {
        let url = "";//"https://hz08tdry07.execute-api.us-east-2.amazonaws.com/prod/admin/?command=edit&id=" + (this.state.key);
        console.log(url);
        let data = {
            //name:(this.state.name === this.state.driver._name?null:this.state.name),
            //cost:(this.state.cost === this.state.driver._cost?null:cost)
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

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <form onSubmit={this.handleSubmit}>
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
        );
    }
}

export default App;
