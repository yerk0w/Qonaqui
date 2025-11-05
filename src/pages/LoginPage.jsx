import AuthForm from '../components/AuthForm';
import Back1Image from '../assets/back1.jpg';
import AnimatedPage from '../components/AnimatedPage';

const LoginPage = () => {
  return (
    <AnimatedPage>
      <AuthForm isLogin={true} backgroundImage={Back1Image} />
    </AnimatedPage>
  );
};
export default LoginPage;