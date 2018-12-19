import React, { PureComponent } from 'react';
import { includes } from 'ramda';
import TKana from '../types/kana';
import kana from '../kana'
import { generateRandomNumber } from '../utils';
import AnswerButtons from './buttons'
import fetchKanaImage from '../components/image'
import './question.css'

interface QuestionProps {
  incrementCorrect: Function,
  incrementIncorrect: Function,
  mode: 'hiragana' | 'katakana' | 'all',
}

interface QuestionState {
  buttonOptions: Array<number>,
  selectedKana: TKana | null
}

export default class Question extends PureComponent<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props)
    this.state = {
      buttonOptions: [],
      selectedKana: null,
    }
  }

  componentDidMount() {
    this.buildQuestion();
  }

  buildQuestion = () => {
    const buttonOptions = [];
    while (buttonOptions.length < 3) {
      const randomNumber = generateRandomNumber(0, kana.length);
      if (!includes(randomNumber, buttonOptions)) {
        buttonOptions.push(randomNumber);
      }
    }
    const selectedKana = kana[buttonOptions[generateRandomNumber(0, 3)]];
    this.setState({ selectedKana, buttonOptions });
  }

  selectImage = (selectedKana: TKana) => {
    switch (this.props.mode) {
      case 'hiragana':
        return selectedKana.hiraganaPath;
      case 'katakana':
        return selectedKana.katakanaPath;
      default:
        if (Math.random() < 0.5) {
          return selectedKana.hiraganaPath;
        } else {
          return selectedKana.katakanaPath;
        }
    }
}

  onClickCorrect = () => {
    this.props.incrementCorrect();
    this.buildQuestion();
  }

  onClickIncorrect = () => {
    this.props.incrementIncorrect();
    this.buildQuestion();
  }

  render() {
    const { selectedKana, buttonOptions } = this.state;
    return (
      <div>
        {selectedKana &&
          (
            <div className='question'>
              {fetchKanaImage(this.selectImage(selectedKana), 'kana-image')}
              <div className='question__buttons'>
                <AnswerButtons
                  buttonOptions={buttonOptions}
                  onClickCorrect={this.onClickCorrect}
                  onClickIncorrect={this.onClickIncorrect}
                  selectedKana={selectedKana}
                />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}