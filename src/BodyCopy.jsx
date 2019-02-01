import React, { Component } from "react";
import PropTypes from 'prop-types';
import './BodyCopy.scss';

const sizes = [ 's', 'm', 'l'] 


class BodyCopy extends Component {
  static propTypes = {
  	text: PropTypes.string,
  	size: PropTypes.oneOf(sizes)
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

export default BodyCopy;
