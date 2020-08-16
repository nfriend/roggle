module Roggle {
  export interface RoggleContainerProps {
    children?: any;
  }

  export interface RoggleContainerState {
    letters?: Array<string>;
  }

  export class RoggleContainer extends React.Component<
    RoggleContainerProps,
    RoggleContainerState
  > {
    private webSocketService = new WebsocketService();
    private dieShuffler = new DieShuffler();
    private audio = new Audio('./audio/diceroll.mp3');
    private gameIdUrlRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$)/i;

    constructor(props: RoggleContainerProps) {
      super(props);

      this.state = {
        letters: null,
      };

      this.webSocketService.on('connect', this.onWebsocketServiceConnect);
      this.webSocketService.on('receive', this.onWebSocketServiceReceive);
      this.webSocketService.connect();
    }

    onWebsocketServiceConnect = () => {
      var gameIdMatches = this.gameIdUrlRegex.exec(window.location.href);
      var gameId = gameIdMatches ? gameIdMatches[1] : GetGuid();

      this.webSocketService.send({
        messageType: 'join',
        gameId: gameId,
      });

      window.history.pushState(null, '', '#/' + gameId);
      $(window).trigger('roggle:joinedgame');
    };

    onWebSocketServiceReceive = (message: any) => {
      console.log('messageReceived: ', message);
      if (message.messageType === 'setDice') {
        console.log('setDice: ', message.letters);
        this.setDice(message.letters);
      } else if (message.messageType === 'initiate') {
        console.log('initiate');
        this.shakeItUp();
      }
    };

    setDice = (newLetters: Array<string>) => {
      console.log('setting: ', newLetters);
      this.audio
        .play()
        .catch((err) =>
          console.log('Browser has autoplay disabled; skipping sound effect.'),
        );
      this.setState({
        letters: newLetters,
      });
    };

    shakeItUp = () => {
      var newLetters = this.dieShuffler.Randomize();
      this.setDice(newLetters);

      this.webSocketService.send({
        messageType: 'setDice',
        letters: newLetters,
      });
    };

    render() {
      return (
        <div className="container">
          <RoggleHeader />
          <hr />
          <DiceContainer letters={this.state.letters} />
          <br />
          <br />
          <button className="btn btn-lg btn-default" onClick={this.shakeItUp}>
            Shake it up!
          </button>
        </div>
      );
    }
  }
}
