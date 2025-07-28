import { GoogleLogin } from "@react-oauth/google";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoogleAuthButton = ({ onSuccess }: { onSuccess: (res: any) => void }) => (
  <GoogleLogin
    onSuccess={onSuccess}
    onError={() => console.log("Google Login Failed")}
  />
);

export default GoogleAuthButton;
