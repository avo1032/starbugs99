// const passport = require("passport"); // passport 미들웨어를 등록하기 위한 묘듈
// const { Strategy: LocalStrategy } = require("passport-local"); // 사용자 인증을 구현할 Strategy(나중에 JWT의 Strategy와 이름이 겹쳐서 다른이름 선언)
// const bcrypt = require("bcrypt"); // 해쉬된 비밀번호를 비교하기 위한 모듈

// const User = require("../schemas/users"); // 데이터 조회

// //passport 옵션 설정 
// // usernameFieId는 passport가 읽을 사용자 아이디 확인
// // passwordFieId는 passport가 읽을 사용자 비밀번호 확인
// const passportConfig = { usernameFieId: "userId", passwordFieId: "password" };


// //매개변수로 3개를 받는다( 아이디, 비밀번호, 인증의 결과를 호출할 done)
// const passportVerify = async ( userId, password, done ) => {
//     try{
//         //유저 아이디로 일치하는 유저 데이터 검색
//         const user = await User.findOne({where: { user_id: userId }});
//         //검색된 유저 데이터가 없다면 에러 표시
//         if(!user){
//             done(null,false,{reason: "존재하지 않는 사용자 입니다."});
//             return;
//         }
//         //검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
//         const compareResult = await bcrypt.compare(password, user.password);
//        //해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
//         if(compareResult){
//             done(null, user);
//             return;
//         }
//         //비밀번호가 다를경우 에러 표시
//         done(null,false,{reason: "올바르지 않은 비밀번호 입니다."});
//     }catch{error}{
//         console.error(error);
//     }
// };

// module.exports = () => {
//     //LocalStrategy에 passportConfig,passportVerify를 인자로 넣어 local로 등록
//     passport.use("local",new LocalStrategy(passportConfig,passportVerify));
// };