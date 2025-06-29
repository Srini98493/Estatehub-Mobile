import { Colors, Layout, Typography, Inputs, Buttons, normalize } from "@/theme/globalStyles";

// Update LinearGradient colors
colors={Colors.gradientPrimary}

// Update styles
const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
  },
  content: {
    // ... existing code ...
    backgroundColor: Colors.backgroundLight,
    // ... existing code ...
  },
  logo: {
    // ... existing code ...
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
    // ... existing code ...
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    // ... existing code ...
  },
  inputContainer: {
    ...Inputs.container,
    // ... existing code ...
  },
  input: {
    ...Inputs.input,
    // ... existing code ...
  },
  forgotPassword: {
    // ... existing code ...
  },
  forgotPasswordText: {
    ...Typography.caption,
    color: Colors.primary,
    // ... existing code ...
  },
  buttonContainer: {
    ...Buttons.buttonContainer,
    // ... existing code ...
  },
  button: {
    // ... existing code ...
  },
  buttonText: {
    ...Typography.buttonText,
    // ... existing code ...
  },
  orContainer: {
    // ... existing code ...
  },
  orLine: {
    // ... existing code ...
    backgroundColor: Colors.borderLight,
    // ... existing code ...
  },
  orText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    // ... existing code ...
  },
  socialButtonsContainer: {
    // ... existing code ...
  },
  socialButton: {
    // ... existing code ...
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.borderLight,
    // ... existing code ...
  },
  socialIcon: {
    // ... existing code ...
  },
  footer: {
    // ... existing code ...
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    // ... existing code ...
  },
  signupText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    // ... existing code ...
  },
}); 