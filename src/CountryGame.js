import React, {Component} from 'react';
import FlagQuestion from './FlagQuestion.js';
import shuffle from 'shuffle-array';

class CountryGame extends Component {
  constructor(props) {
    super(props);
    this.GAME_STATES = {
      QUESTION: 1,
      ANSWER_WRONG: 2,
      ANSWER_CORRECT: 3
    }

    this.state = {
      countries: [],
      options: [],
      correctOption: undefined,
      gameState: undefined,
      flagLoading: true,
      correct: 0,
      incorrect: 0
    }

    this.onGuess = this.onGuess.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleLoadError = this.handleLoadError.bind(this);
  }

  componentDidMount() {
    fetch("https://restcountries.eu/rest/v2/all")
      .then(resp => resp.json())
      .then(countries => {
        const correctOption = Math.floor(Math.random() * countries.length);
        const options = this._getOptions(correctOption, countries);
        this.setState({
          countries,
          correctOption,
          options,
          gameState: this.GAME_STATES.QUESTION
        });
      })
      .catch(console.warn)
  }

  handleLoad() {
    this.setState({flagLoading: false});
  }

  handleLoadError() {

  }

  onGuess(answer) {
    const {correctOption} = this.state;
    let gameState = answer === correctOption ?
                      this.GAME_STATES.ANSWER_CORRECT :
                      this.GAME_STATES.ANSWER_WRONG;
    this.setState({gameState});
  }

  nextQuestion() {
    const {countries} = this.state;
    const correctOption = Math.floor(Math.random() * countries.length);
    const options = this._getOptions(correctOption, countries);
    this.setState({
      correctOption,
      options,
      gameState: this.GAME_STATES.QUESTION,
      flagLoading: true
    });
  }

  _getOptions(correctOption, countries) {
    let options = [correctOption];
    let tries = 0;
    while (options.length < 4 && tries < 15) {
      let option = Math.floor(Math.random() * countries.length);
      if (options.indexOf(option) === -1 ) {
        options.push(option);
      } else {
        tries++;
      }
    }
    return shuffle(options);
  }

  render() {
    let {countries, correctOption, options, gameState, flagLoading} = this.state;
    const showForm = gameState === this.GAME_STATES.QUESTION;
    let output = <div>Loading...</div>;
    if (correctOption !== undefined) {
      const {flag, name} = countries[correctOption];
      output = [];
      let opts = options.map(opt => {
        return {
          id: opt,
          name: countries[opt].name
        };
      })
      if (flagLoading) {
        output.push(<FlagQuestion
                      key={1}
                      onGuess={this.onGuess}
                      handleLoad={this.handleLoad}
                      onError={this.handleLoadError}
                      options={opts}
                      showForm={showForm}
                      flag={flag}
                      hideFlag={true}
                      name={name} />);
        output.push(<div key={10}>Loading...</div>)
      } else {
        output.push(<FlagQuestion
                      key={1}
                      onGuess={this.onGuess}
                      options={opts}
                      showForm={showForm}
                      flag={flag}
                      name={name} />);
      }

      if (!showForm) {
        if (gameState === this.GAME_STATES.ANSWER_CORRECT) {
          output.push(<div key={2}>
            Correct!: {name}
          </div>);
        } else {
          output.push(<div key={3}>
            Incorrect! Correct Answer: {name}
          </div>);
        }
        output.push(<button key={4} onClick={this.nextQuestion}>
          NEXT
        </button>);

      }
    }
    return (
      <div>
        {output}
      </div>
    );
  }
}

export default CountryGame;
