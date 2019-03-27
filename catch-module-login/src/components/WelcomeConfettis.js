import React from 'react';
import { ART, Animated, Easing, View } from 'react-native';
import { darken } from 'polished';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Button,
  Text,
  colors as themeColors,
  withDimensions,
  Fader,
} from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';
import Header from './Header';
import drop from './drop';

const Log = createLogger('confettis:');

const PREFIX = 'catch.module.login.WelcomeConfettis';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  continueButton: <FormattedMessage id={`${PREFIX}.continueButton`} />,
};

const WelcomeMessage = ({ name, onContinue, viewport }) => (
  <Box
    absolute
    w={1}
    style={{
      top: 0,
      height: '100%',
      left: 0,
      zIndex: 1,
    }}
    align="center"
    justify="center"
  >
    <Fader show={true} delayIn={1500}>
      <Box
        align="center"
        p={32}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 6,
          maxWidth: 407,
          transform: [{ translateY: -110 }],
        }}
      >
        <Header
          title={COPY['title']({ name })}
          subtitle={COPY['subtitle']}
          viewport={viewport}
        />
        <Box align="center" mt={1}>
          <Button onClick={onContinue} color="#109E8B">
            {COPY['continueButton']}
          </Button>
        </Box>
      </Box>
    </Fader>
  </Box>
);

const { Surface, Path, Shape, Transform } = ART;

const AnimatedShape = Animated.createAnimatedComponent(Shape);

const retina = 1;

// Constants
const speed = 50;
const duration = 1.0 / speed;
const confettiCount = 150;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const green = '#86ECCE';
const red = '#FF807C';
const blue = '#BBCEFF';
const orange = '#FFB638';
const cOffset = 0.2;
const colors = [
  [green, darken(cOffset, green)],
  [red, darken(cOffset, red)],
  [blue, darken(cOffset, blue)],
  [orange, darken(cOffset, orange)],
];

// Physics
function Vector2(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.Length = function() {
    return Math.sqrt(this.SqrLength());
  };
  this.SqrLength = function() {
    return this.x * this.x + this.y * this.y;
  };
  this.Add = function(_vec) {
    this.x += _vec.x;
    this.y += _vec.y;
  };
  this.Sub = function(_vec) {
    this.x -= _vec.x;
    this.y -= _vec.y;
  };
  this.Div = function(_f) {
    this.x /= _f;
    this.y /= _f;
  };
  this.Mul = function(_f) {
    this.x *= _f;
    this.y *= _f;
  };
  this.Normalize = function() {
    var sqrLen = this.SqrLength();
    if (sqrLen != 0) {
      var factor = 1.0 / Math.sqrt(sqrLen);
      this.x *= factor;
      this.y *= factor;
    }
  };
  this.Normalized = function() {
    var sqrLen = this.SqrLength();
    if (sqrLen != 0) {
      var factor = 1.0 / Math.sqrt(sqrLen);
      return new Vector2(this.x * factor, this.y * factor);
    }
    return new Vector2(0, 0);
  };
}
Vector2.Lerp = function(_vec0, _vec1, _t) {
  return new Vector2(
    (_vec1.x - _vec0.x) * _t + _vec0.x,
    (_vec1.y - _vec0.y) * _t + _vec0.y,
  );
};
Vector2.Distance = function(_vec0, _vec1) {
  return Math.sqrt(Vector2.SqrDistance(_vec0, _vec1));
};
Vector2.SqrDistance = function(_vec0, _vec1) {
  var x = _vec0.x - _vec1.x;
  var y = _vec0.y - _vec1.y;
  return x * x + y * y;
};
Vector2.Scale = function(_vec0, _vec1) {
  return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
};
Vector2.Min = function(_vec0, _vec1) {
  return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
};
Vector2.Max = function(_vec0, _vec1) {
  return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
};
Vector2.ClampMagnitude = function(_vec0, _len) {
  var vecNorm = _vec0.Normalized;
  return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
};
Vector2.Sub = function(_vec0, _vec1) {
  return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
};

function ConfettiPaper(_x, _y) {
  this.pos = new Vector2(_x, _y);
  this.path = null;
  this.rotationSpeed = Math.random() * 600 + 800;
  this.angle = DEG_TO_RAD * Math.random() * 360;
  this.rotation = DEG_TO_RAD * Math.random() * 360;
  this.cosA = 1.0;
  this.size = 5.0;
  // this.sizeH = 100.0;
  // this.sizeW = 200.0;
  this.radius = 10;
  this.oscillationSpeed = Math.random() * 1.5 + 0.5;
  this.xSpeed = 40.0;
  this.ySpeed = Math.random() * 60 + 50.0;
  this.corners = new Array();
  this.time = Math.random();
  var ci = Math.round(Math.random() * (colors.length - 1));
  this.frontColor = colors[ci][0];
  this.backColor = colors[ci][1];
  for (var i = 0; i < 4; i++) {
    var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
    var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
    this.corners[i] = new Vector2(dx, dy);
  }
  /**
   * WIP: improvements to the shape of confettis
  var dx0 = Math.cos(this.angle + DEG_TO_RAD * (0 * 120 + 120));
  var dy0 = Math.sin(this.angle + DEG_TO_RAD * (0 * 120 + 120));
  this.corners[0] = new Vector2(dx0, dy0);

  var dx1 = Math.cos(this.angle + DEG_TO_RAD * (1 * 120 + 120));
  var dy1 = Math.sin(this.angle + DEG_TO_RAD * (1 * 120 + 120));
  this.corners[1] = new Vector2(dx1, dy1);

  var dx2 = Math.cos(this.angle + DEG_TO_RAD * (2 * 120 + 120));
  var dy2 = Math.sin(this.angle + DEG_TO_RAD * (2 * 120 + 120));
  this.corners[2] = new Vector2(dx2, dy2);
  */

  this.Update = function(_dt, cb) {
    this.time += _dt;
    this.rotation += this.rotationSpeed * _dt;
    this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
    this.pos.x +=
      Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
    this.pos.y += this.ySpeed * _dt;
    // if (this.pos.y > ConfettiPaper.bounds.y) {
    //   this.pos.x = Math.random() * ConfettiPaper.bounds.x;
    //   this.pos.y = 0;
    // }
  };
  this.Draw = function(_np) {
    if (this.cosA > 0) {
      this.fillStyle = this.frontColor;
    } else {
      this.fillStyle = this.backColor;
    }
    _np.moveTo(
      (this.pos.x + this.corners[0].x * this.size) * retina,
      (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina,
    );
    for (var i = 1; i < 4; i++) {
      _np.lineTo(
        (this.pos.x + this.corners[i].x * this.size) * retina,
        (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina,
      );
    }
    /**
   * WIP: improvements to the shape of confettis
    let tl = this.radius;
    let tr = this.radius;
    let br = this.radius;
    let bl = this.radius;

    _np.moveTo(
      (this.pos.x + (tr + tl) + this.corners[0].x * this.sizeH) * retina,
      (this.pos.y + tr + this.corners[0].y * this.sizeH * this.cosA) * retina
    );
    _np.arcTo(
      (this.pos.x - tr + this.corners[0].x * this.sizeH) * retina,
      (this.pos.y - tr + this.corners[0].y * this.sizeH * this.cosA) * retina
    );
    _np.lineTo(
      (this.pos.x + this.corners[1].x * this.sizeH) * retina,
      (this.pos.y + (tl + tl) + this.corners[1].y * this.sizeH * this.cosA) *
        retina
    );
    _np.arcTo(
      (this.pos.x + (tl + tl) + this.corners[1].x * this.sizeH) * retina,
      (this.pos.y + this.corners[1].y * this.sizeH * this.cosA) * retina
    );
    _np.lineTo(
      (this.pos.x - (tl + tl) + this.corners[2].x * this.sizeW) * retina,
      (this.pos.y - (tl + tl) + this.corners[2].y * this.sizeW * this.cosA) *
        retina
    );
    _np.arcTo(
      (this.pos.x - (tl + tl) + tl + this.corners[2].x * this.sizeW) * retina,
      (this.pos.y -
        (tl + tl) +
        tl +
        this.corners[2].y * this.sizeW * this.cosA) *
        retina
    );
    _np.arcTo(
      (this.pos.x - tl + this.corners[2].x * this.sizeW) * retina,
      (this.pos.y -
        (tl + tl) +
        tl +
        this.corners[2].y * this.sizeW * this.cosA) *
        retina
    );
    */
    this.path = _np.close();
  };
}
ConfettiPaper.bounds = new Vector2(0, 0);

class WelcomeConfettis extends React.PureComponent {
  constructor(props) {
    super(props);
    const { size } = props;
    const width = size.window.width;
    const height = size.window.height;
    ConfettiPaper.bounds = new Vector2(width, height);
    const confettis = [];
    for (let i = 0; i < confettiCount; i++) {
      confettis[i] = new ConfettiPaper(
        Math.random() * width,
        Math.random() * -height,
      );
      confettis[i].Draw(new Path());
    }
    this.state = {
      confettis,
    };
  }
  componentDidMount() {
    this.update();
  }
  update = () => {
    const { confettis } = this.state;
    for (let i = 0; i < confettiCount; i++) {
      confettis[i].Update(duration);
      confettis[i].Draw(new Path());
    }
    this.setState({ confettis: [].concat(confettis) });
    this.interval = requestAnimationFrame(() => this.update());
  };
  stop = () => cancelAnimationFrame(this.interval);
  render() {
    const { size, name, onContinue, viewport } = this.props;
    return (
      <Box style={{ backgroundColor: themeColors.white }} flex={1}>
        <Surface width={size.window.width} height={size.window.height}>
          {this.state.confettis.map((confetti, i) => (
            <Shape key={`c-${i}`} d={confetti.path} fill={confetti.fillStyle} />
          ))}
        </Surface>
        <WelcomeMessage
          name={name}
          onContinue={onContinue}
          viewport={viewport}
        />
      </Box>
    );
  }
}

const Component = withDimensions(WelcomeConfettis);

Component.displayName = 'WelcomeConfettis';

export default Component;
