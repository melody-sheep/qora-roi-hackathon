import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ParticlesBackground() {
  const particles = useRef(
    Array.from({ length: 50 }).map(() => ({  // Increased from 30 to 50
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 2,  // Increased size
      speed: Math.random() * 1 + 0.5,  // Increased speed
      opacity: Math.random() * 0.5 + 0.3,  // Increased opacity
    }))
  ).current;

  const animations = useRef(
    particles.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    particles.forEach((_, index) => {
      // Random starting point
      animations[index].setValue(Math.random());
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[index], {
            toValue: 1,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index], {
            toValue: 0,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
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