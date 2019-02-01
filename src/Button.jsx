import React, { Component } from "react";
import PropTypes from 'prop-types';

const types = [ 'primary', 'secondary', 'disabled']; 
const buttonStates = ['submit', 'disabled', 'reset'];

class Button extends Component {
  static propTypes = {
  	text: PropTypes.string,
  	modifier: PropTypes.oneOf(types),
  	type: PropTypes.oneOf(buttonStates)
  }

  render() {
  	const { text, size } = this.props;

    return (
      <div className={`copy-container`}>
        <div className={`copy-${size}`}>{text}</div>
      </div>
    );
  }
}

export default Button;
