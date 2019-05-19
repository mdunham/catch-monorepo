import { Animated } from 'react-native';

const globSpeed = 50;
const duration = 1 / globSpeed;
const DEG_TO_RAD = Math.PI / 180;

class Fall {
  constructor(config = {}) {
    this._to = config.to;
    this._speed = Math.random() * 60 + 50;
    this._time = Math.random();
  }
  start(fromValue, onUpdate, onEnd) {
    this._active = true;
    this._fromValue = fromValue;
    this._value = fromValue;
    this._onUpdate = onUpdate;
    this._onEnd = onEnd;
    this._startTime = Date.now();
    this._animationFrame = requestAnimationFrame(() => this.onUpdate(duration));
  }
  onUpdate = _dt => {
    this._time += _dt;
    this._value += this._speed * _dt;
    if (this._to && this._value === this._to) {
      this._onUpdate(this._to);
      this.__debouncedOnEnd({ finished: true });
      return;
    }
    this._onUpdate(this._value);
    if (this._active) {
      this._animationFrame = requestAnimationFrame(() =>
        this.onUpdate(duration),
      );
    }
  };
  stop() {
    this._active = false;
    cancelAnimationFrame(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
  __debouncedOnEnd(result) {
    const onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  }
}

class Sway {
  constructor(config = {}) {
    this._to = config.to;
    this._oscillationSpeed = Math.random() * 1.5 + 0.5;
    this._speed = 40;
    this._time = Math.random();
  }
  start(fromValue, onUpdate, onEnd) {
    this._active = true;
    this._fromValue = fromValue;
    this._value = fromValue;
    this._onUpdate = onUpdate;
    this._onEnd = onEnd;
    this._startTime = Date.now();
    this._animationFrame = requestAnimationFrame(() => this.onUpdate(duration));
  }
  onUpdate = _dt => {
    this._time += _dt;
    this._value +=
      Math.cos(this._time * this._oscillationSpeed) * this._speed * _dt;
    if (this._to && this._value === this._to) {
      this._onUpdate(this._to);
      this.__debouncedOnEnd({ finished: true });
      return;
    }
    this._onUpdate(this._value);
    if (this._active) {
      this._animationFrame = requestAnimationFrame(() =>
        this.onUpdate(duration),
      );
    }
  };
  stop() {
    this._active = false;
    cancelAnimationFrame(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
  __debouncedOnEnd(result) {
    const onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  }
}

class Rotation {
  constructor(config = {}) {
    this._to = config.to;
    this._rotationSpeed = Math.random() * 600 + 800;
  }
  start(fromValue, onUpdate, onEnd) {
    this._active = true;
    this._fromValue = fromValue;
    this._value = fromValue;
    this._onUpdate = onUpdate;
    this._onEnd = onEnd;
    this._startTime = Date.now();
    this._animationFrame = requestAnimationFrame(() => this.onUpdate(duration));
  }
  onUpdate = _dt => {
    this._value += this._rotationSpeed * _dt;
    if (this._to && this._value === this._to) {
      this._onUpdate(this._to);
      this.__debouncedOnEnd({ finished: true });
      return;
    }
    this._onUpdate(this._value);
    if (this._active) {
      this._animationFrame = requestAnimationFrame(() =>
        this.onUpdate(duration),
      );
    }
  };
  stop() {
    this._active = false;
    cancelAnimationFrame(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
  __debouncedOnEnd(result) {
    const onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  }
}

/**
 * The drop function encapuslates all the different animations to create a drop
 * including Fall, Sway and Rotation
 */
const drop = (vector2, rotation, config) => {
  return Animated.parallel(
    [
      {
        start: cb => vector2.x.animate(new Sway()),
        stop: vector2.x.stopAnimation,
        reset: vector2.x.resetAnimation,
      },
      {
        start: cb => vector2.y.animate(new Fall()),
        stop: vector2.y.stopAnimation,
        reset: vector2.y.resetAnimation,
      },
      {
        start: cb => rotation.animate(new Rotation()),
        stop: rotation.stopAnimation,
        reset: rotation.resetAnimation,
      },
    ],
    { stopTogether: false },
  );
};

export default drop;
