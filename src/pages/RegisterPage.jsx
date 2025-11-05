import AuthForm from '../components/AuthForm';
import Back2Image from '../assets/back2.jpg';
import AnimatedPage from '../components/AnimatedPage';

const RegisterPage = () => {
  return (
    <AnimatedPage>
      <AuthForm isLogin={false} backgroundImage={Back2Image} />
    </AnimatedPage>
  );
};
export default RegisterPage;