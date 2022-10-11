const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    video: false,
    viewportWidth: 1600,
    viewportHeight: 900
  },

  env: {
    //NewPlatform
    firstName: "Ivan",
    lastName: "Inanov",
    middleName: "Ivanovich",
  	newPlatformApiUrl: 'https://api-dev.new-platform.ipst-dev.com/api',
    newPlatformUrl: 'https://front-dev.new-platform.ipst-dev.com',
    email: 'ivan@mail.ru',
    emailAlreadyExist: "maria@gmail.com",
    newEmail: 'ivanNew@mail.ru',
    pass: "testpassword",
    badPass: "faefaefaefaef",
    addStudentMail: "student@fexbox.org",
    tempEmailTeacher: "test_teacher@fexbox.org",
    nameImage: 'Im',


    demoqaUrl: 'https://demoqa.com/',
    correctEmail: 'test@ipst.com',
    correctPass: 'testtest',
    correctFirstName: 'Alex',
    correctSecondName: 'Swag',
    incorrectLogin: '$$$test$$$^%&*$!',
    correctAddress: 'Australia, Melbourne, 123 Collins Street'
  }
});
