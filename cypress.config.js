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
    imageBlock: 'https://99px.ru/sstorage/56/2021/11/mid_343333_176671.jpg',
    audioBlock: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    videoBlock: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    textBlock: 'testtetstest',
    ParentFolder: 'ParentFolder',
    Folder: 'Folder',


    demoqaUrl: 'https://demoqa.com/',
    correctEmail: 'test@ipst.com',
    correctPass: 'testtest',
    correctFirstName: 'Alex',
    correctSecondName: 'Swag',
    incorrectLogin: '$$$test$$$^%&*$!',
    correctAddress: 'Australia, Melbourne, 123 Collins Street'
  }
});
