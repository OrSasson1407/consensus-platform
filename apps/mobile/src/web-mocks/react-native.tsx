import React from 'react';

// Common stylesheet helper that returns the styles object directly
export const StyleSheet = {
  create: (styles: any) => styles,
};

// Map View component to an HTML div
export const View = React.forwardRef(({ style, children, pointerEvents, ...props }: any, ref: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        borderWidth: 0,
        pointerEvents: pointerEvents,
        ...flattenedStyle
      }}
      {...props}
    >
      {children}
    </div>
  );
});

// Map Text component to an HTML span
export const Text = ({ style, children, ...props }: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  return (
    <span
      style={{
        display: 'inline-block',
        boxSizing: 'border-box',
        borderWidth: 0,
        ...flattenedStyle
      }}
      {...props}
    >
      {children}
    </span>
  );
};

// Map ScrollView component to an HTML div with auto scrolling
export const ScrollView = ({ style, children, contentContainerStyle, ...props }: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  const containerStyle = Array.isArray(contentContainerStyle) ? Object.assign({}, ...contentContainerStyle) : contentContainerStyle;
  return (
    <div
      style={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        borderWidth: 0,
        ...flattenedStyle
      }}
      {...props}
    >
      <div style={{ display: 'flex', flexDirection: 'column', ...containerStyle }}>
        {children}
      </div>
    </div>
  );
};

// Map TouchableOpacity to a button that scales smoothly on hover/press
export const TouchableOpacity = ({ style, children, onPress, disabled, activeOpacity, ...props }: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        ...flattenedStyle
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Map TextInput component to an HTML input
export const TextInput = ({
  style,
  onChangeText,
  placeholderTextColor,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  editable,
  returnKeyType,
  selectTextOnFocus,
  clearButtonMode,
  ...props
}: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  return (
    <input
      type={secureTextEntry ? 'password' : 'text'}
      disabled={editable === false}
      style={{
        border: 'none',
        outline: 'none',
        background: 'transparent',
        boxSizing: 'border-box',
        width: '100%',
        ...flattenedStyle
      }}
      onChange={(e) => onChangeText?.(e.target.value)}
      {...props}
    />
  );
};

// Placeholder components
export const SafeAreaView = View;
export const KeyboardAvoidingView = View;
export const TouchableWithoutFeedback = ({ children, onPress }: any) => {
  return <div onClick={onPress} style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>{children}</div>;
};

export const ActivityIndicator = ({ color, size }: any) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-5 w-5 border-b-2"
        style={{ borderColor: color || '#EDE0FF' }}
      />
    </div>
  );
};

export const StatusBar = () => null;

export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios || obj.default,
};

export const Dimensions = {
  get: (dim: 'window' | 'screen') => ({
    width: 360,
    height: 780,
  }),
};

export const Keyboard = {
  dismiss: () => {},
};

export const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    alert(`${title}\n\n${message || ''}`);
    if (buttons && buttons.length > 0) {
      // Execute last active button (e.g., confirmation button)
      const lastBtn = buttons[buttons.length - 1];
      if (lastBtn && lastBtn.onPress) {
        lastBtn.onPress();
      }
    }
  },
};
