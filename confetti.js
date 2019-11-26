import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../lib/styleguide";

const defaultColors = ["#ff0000", "#00ff00", "#0000ff"];

const defaultConfig = {
  angle: 90,
  duration: 3000,
  spread: 45,
  startVelocity: 25,
  dragFriction: 0.1,
  stagger: 0,
  colors: defaultColors,
  elementCount: 50
};

function randomPhysics(angle, spread, startVelocity) {
  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);
  return {
    x: 0,
    y: 0,
    wobble: Math.random() * 10,
    wobbleSpeed: 0.1 + Math.random() * 0.1,
    velocity: startVelocity * 0.5 + Math.random() * startVelocity,
    angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
    angle3D: -(Math.PI / 4) + Math.random() * (Math.PI / 2),
    tiltAngle: Math.random() * Math.PI,
    tiltAngleSpeed: 0.1 + Math.random() * 0.3
  };
}

function updateFetti(fetti, progress, dragFriction) {
  /* eslint-disable no-param-reassign */
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += fetti.physics.wobbleSpeed;
  fetti.physics.y += 3;
  fetti.physics.tiltAngle += fetti.physics.tiltAngleSpeed;

  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + 10 * Math.cos(wobble);
  const wobbleY = y + 10 * Math.sin(wobble);

  fetti.physics.velocity -= fetti.physics.velocity * dragFriction;

  fetti.ref.setNativeProps({
    style: {
      opacity: 1 - progress,
      transform: [
        { translateX: wobbleX },
        { translateY: wobbleY },
        { rotateX: `${tiltAngle}rad` },
        { rotateY: `${tiltAngle}rad` }
      ]
    }
  });
}

function animate(fettis, dragFriction, duration, stagger, explosionController) {
  let startTime;

  return new Promise(resolve => {
    function update(time) {
      if (explosionController.stopped) {
        return;
      }
      if (!startTime) startTime = time;

      const elapsed = time - startTime;
      const progress = startTime === time ? 0 : (time - startTime) / duration;
      fettis.slice(0, Math.ceil(elapsed / stagger)).forEach(fetti => {
        updateFetti(fetti, progress, dragFriction);
      });

      if (time - startTime < duration) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(update);
  });
}

const getConfig = props => ({
  ...defaultConfig,
  ...props.config
});

export default class Confetti extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fettiCount: 0
    };

    this.fettiRefs = [];
    this.queuedExplosion = false;
    this.explosionInProgress = false;
    this.explosionController = {
      stopped: false
    };

    this.setFettiRef = this.setFettiRef.bind(this);
    this.startExplosion = this.startExplosion.bind(this);
  }

  setFettiRef(index, ref) {
    this.fettiRefs[index] = ref;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.explosionInProgress) {
      return;
    }

    if (newProps.active && !this.props.active) {
      this.setState({
        fettiCount: getConfig(newProps).elementCount
      });
      this.queuedExplosion = true;
    }
  }

  componentWillUnmount() {
    this.explosionController.stopped = true;
  }

  async startExplosion() {
    const {
      angle,
      spread,
      startVelocity,
      dragFriction,
      duration,
      stagger
    } = getConfig(this.props);

    this.explosionInProgress = true;
    const fettis = this.fettiRefs.map(fettiRef => ({
      ref: fettiRef,
      physics: randomPhysics(angle, spread, startVelocity)
    }));

    await animate(
      fettis,
      dragFriction,
      duration,
      stagger,
      this.explosionController
    );

    this.setState({ fettiCount: 0 });
    this.explosionInProgress = false;
    this.fettiRefs = [];
  }

  render() {
    const { fettiCount } = this.state;
    const { colors } = getConfig(this.props);

    const fettis = Array.from({ length: fettiCount }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.fetti,
          { backgroundColor: colors[index % colors.length] }
        ]}
        ref={ref => this.setFettiRef(index, ref)}
      />
    ));

    return <View>{fettis}</View>;
  }

  componentDidUpdate() {
    if (this.queuedExplosion) {
      this.startExplosion();
      this.queuedExplosion = false;
    }
  }
  componentDidMount() {
    if (this.props.active) {
      this.setState({
        fettiCount: getConfig(this.props).elementCount
      });
      this.queuedExplosion = true;
    }
  }
}

const styles = StyleSheet.create({
  fetti: {
    position: "absolute",
    width: 10,
    height: 10
  }
});

Confetti.propTypes = {
  active: PropTypes.bool,
  config: PropTypes.object
};
