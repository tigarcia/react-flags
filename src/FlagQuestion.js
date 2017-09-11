import React, {Component} from 'react';
import FlagChoices from './FlagChoices.js'
import './FlagQuestion.css';


class FlagQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: undefined,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({answer: Number(e.target.value)});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onGuess(this.state.answer);
  }

  render() {
    const {flag, showForm, options, handleLoad, hideFlag} = this.props;
    const {answer} = this.state;
    let form = undefined;
    let opts = [];
    if (options && options.length > 0) {
      opts = options.map(opt => {
        return {
          ...opt,
          checked: answer === opt.id ? true : false
        }
      });
    }
    if (showForm) {
      form = <FlagChoices handleChange={this.handleChange}
                          handleSubmit={this.handleSubmit}
                          options={opts} />;
    }

    let styles = {};
    if (hideFlag) {
      styles.display = 'none';
    }
    return (
      <div>
        <img
           onLoad={handleLoad}
           style={styles}
           className="flag"
           src={flag}
           alt="Guess the flag"
         />
        {form}
      </div>
    );
  }
}

export default FlagQuestion;
