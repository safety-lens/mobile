export const router = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
};

export const useRouter = () => router;
export const SplashScreen = {
  hideAsync: jest.fn(),
};
