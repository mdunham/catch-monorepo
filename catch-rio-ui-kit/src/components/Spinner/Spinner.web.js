import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import animationDataPink from './spinner-pink.json';
import animationDataGray from './spinner-gray.json';

class Spinner extends React.PureComponent {
  constructor() {
    super();
    this.container = React.createRef();
  }
  componentDidMount() {
    const { large } = this.props;
    this.animation = lottie.loadAnimation({
      container: this.container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: large ? animationDataPink : animationDataGray,
    });
  }
  render() {
    const { large } = this.props;
    const styles = {
      width: large ? 60 : 30,
      height: large ? 60 : 30,
    };
    return <div ref={this.container} style={styles} />;
  }
}

export default Spinner;
