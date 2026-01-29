import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

function ParticlesBackground({ count = 20 }) {
  // Use a smaller default count for performance
  const particles = useRef(
    Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.4 + 0.2,
    }))
  ).current;

  const animations = useRef(
    particles.map(() => new Animated.Value(0))
  ).current;

  // Keep references to the loop animations so we can stop them on unmount
  const loops = useRef([]);

  useEffect(() => {
    particles.forEach((_, index) => {
      // Random starting point
      animations[index].setValue(Math.random());
      
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(animations[index], {
            toValue: 1,
            duration: Math.random() * 2500 + 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index], {
            toValue: 0,
            duration: Math.random() * 2500 + 1500,
            useNativeDriver: true,
          }),
        ])
      );

      loops.current.push(loop);
      loop.start();
    });

    return () => {
      // Stop all running loops on unmount to avoid leftover animations
      loops.current.forEach(l => l.stop());
      loops.current = [];
    };
  }, [count, animations, particles]);

  // Prevent touches from being intercepted by the background
  const containerPointerEvents = 'none';

  return (
    <View style={styles.container} pointerEvents={containerPointerEvents}>
      {/* Background gradient */}
      <View style={styles.gradientBackground} />
      
      {particles.map((particle, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],  // Increased movement
        });

        const opacity = animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [particle.opacity, particle.opacity * 0.8, particle.opacity * 0.6],
        });

        const scale = animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                opacity,
                transform: [
                  { translateY },
                  { scale }
                ],
                backgroundColor: `rgba(96, 165, 250, ${particle.opacity})`, // Brighter blue
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Darker overlay
  },
  particle: {
    position: 'absolute',
  },
});

ParticlesBackground.displayName = 'ParticlesBackground';

export default React.memo(ParticlesBackground);