import 'cypress-file-upload';

Cypress.Commands.add('login', () => {                   // Отдельная функция выполнения запроса авторизации
  cy.request({                                    // отправка запроса на API
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/auth/login",  // адрес API из окружения + данные для запроса
    failOnStatusCode: false,
    body: {
      "email": Cypress.env("email"),                   // Логин и пароль берем из окружения
      "password": Cypress.env("pass")              
    },
  }).as('login')
  .its('body')
  .then((body) => {
    cy.setCookie("accessToken", body.accessToken)
    Cypress.env('accessToken', body.accessToken)
    cy.setCookie("refreshToken", body.refreshToken) 
    cy.setCookie('user', '{%22id%22:%22775395a6-d2d8-47f0-ab4e-1a55689905cf%22%2C%22userRole%22:%22teacher%22%2C%22email%22:%22ivan@fexbox.org%22%2C%22firstName%22:%22Ivan%22%2C%22lastName%22:%22Inanov%22%2C%22middleName%22:%22Ivanovich%22%2C%22avatarUrl%22:null}')      // Заносим Token в localestorage
  })
})

Cypress.Commands.add('createSubject', (title, id_subject) => {    // создание предмета
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/subjects", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "title": title
    },
  }).as('createSubject')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_subject, response.body.id)
  })
})


Cypress.Commands.add('createGroup', (title, id_subject, id_group) => {    // создание группы
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/groups", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "title": title,
      "subjectId": Cypress.env(id_subject)
    },
  }).as('createGroup')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_group, response.body.id)
  })
})

Cypress.Commands.add('visitGroup', (id_subject,id_group) => {    // зайти на страницу группы
  cy.visit(Cypress.env('newPlatformUrl')+'/subject/'+Cypress.env(id_subject)+'/group/'+Cypress.env(id_group))
})

Cypress.Commands.add('deleteSubject', (id_subject) => {    // удаление предмета
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/subjects/"+Cypress.env(id_subject), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('deleteSubject')
  .then((response) =>{
    expect(response.status).to.eq(200)
    expect(response.body.message).to.eq('Предмет успешно удалён')
  })
})


Cypress.Commands.add('deleteGroup', (id_group) => {    // создание группы
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/groups/"+Cypress.env(id_group), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },

  }).as('deleteGroup')
  .then((response) =>{
    expect(response.status).to.eq(200)
    expect(response.body.message).to.eq('Группа успешно удалена')
  })
})


Cypress.Commands.add('tempMailId', (email) => {    // Получение id письма на временной почте
  cy.request({ 
    method: 'GET',
    url: 'https://tempmail.plus/api/mails?email='+email+'&limit=20&epin=', 
    failOnStatusCode: false,
  }).as('tempMail#1')
  .then((response) =>{
    expect(response.status).to.eq(200)
    Cypress.env('first_id',response.body.first_id)
    for (let i = 0; i < response.body.mail_list.length; i++){
      if(response.body.mail_list[i].subject == "Вас зарегистрировал преподаватель на платформе!"){
        Cypress.env('mail_id', response.body.mail_list[i].mail_id)
      }
    }
  })
})

Cypress.Commands.add('tempMailCode', () => {    // Открытие письма
  cy.request({ 
    method: 'GET',
    url: 'https://tempmail.plus/api/mails/'+Cypress.env('mail_id')+'?email='+Cypress.env('addStudentMail')+'&epin=',
    failOnStatusCode: false,
  }).as('tempMail#2')
  .then((response) =>{
    expect(response.status).to.eq(200)
    Cypress.env('passwordStudent', response.body.text.split('Пароль: ')[1])
  })
})

Cypress.Commands.add('deleteTempMails', (email) => {    // удаление писем
  cy.request({ 
    method: 'DELETE',
    url: 'https://tempmail.plus/api/mails/?email='+email+'&first_id='+Cypress.env('first_id')+'&epin:',
    failOnStatusCode: false,
  }).as('deleteTempMails')
  .then((response) =>{
    expect(response.status).to.eq(200)
  })
})


Cypress.Commands.add('loginNewStudent', () => { // Отдельная функция выполнения запроса авторизации
  cy.request({                                    // отправка запроса на API
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/auth/login",  // адрес API из окружения + данные для запроса
    failOnStatusCode: false,
    body: {
      "email": Cypress.env("addStudentMail"),                   // Логин и пароль берем из окружения
      "password": Cypress.env("passwordStudent")              
    },
  }).as('loginNewStudent')
  .then((response)=>{
    expect(response.status).to.eq(201)
  })
})

Cypress.Commands.add('deleteAfterSubject', (id_subject) => {    // удаление предмета
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/subjects/"+Cypress.env(id_subject), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('deleteSubject')
})

Cypress.Commands.add('getMySubjects', (title) => {    // получение всех предметов
  cy.request({ 
    method: 'GET',
    url: Cypress.env('newPlatformApiUrl')+"/subjects", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('getMySubjects')
  .then((response) =>{
    for (let i = 0; i < response.body.length; i++) {
      if (response.body[i].title == title){
        Cypress.env('id_subject', response.body[i].id)
        break
      }
    }
  })
})

Cypress.Commands.add('getUser', (email) => {    // получение всех пользователей
  cy.request({ 
    method: 'GET',
    url: Cypress.env('newPlatformApiUrl')+"/users", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('getUser')
  .then((response) =>{
    for (let i = 0; i < response.body.length; i++) {
      if (response.body[i].email == email){
        Cypress.env('id_user', response.body[i].id)
        break
      }
    }
  })
})

Cypress.Commands.add('createStudent', (email, id_group) => {    // создание студента
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/groups/user",
    failOnStatusCode: false,
    body:{
      "userEmail": email,
      "groupId": Cypress.env(id_group)
    },
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('createStudent')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env('id_student', response.body.id)
  })
})

Cypress.Commands.add('createUser', (email) => {    // создание учителя
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/users", 
    failOnStatusCode: false,
    body:{
      "email": email,
      "userRole": "teacher",
      "firstName": "test",
      "lastName": "test",
      "middleName": "test",
      "password": "testtest"
    },
  }).as('createUser')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env('id_user', response.body.id)
  })
})

Cypress.Commands.add('deleteUser', () => {    // удаление юзера
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/users/"+Cypress.env('id_user'), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('deleteUser')
})


Cypress.Commands.add('tempMailRecoveryId', (email) => {
  cy.request({ 
    method: 'GET',
    url: 'https://tempmail.plus/api/mails?email='+email+'&limit=20&epin=', 
    failOnStatusCode: false,
  }).as('tempMail#1')
  .then((response) =>{
    expect(response.status).to.eq(200)
    expect(response.body.mail_list[0].subject).to.eq("Восстановление пароля")
    Cypress.env('mail_id', response.body.mail_list[0].mail_id)
  })
})

Cypress.Commands.add('tempMailRecoveryCode', (email) => {
  cy.request({ 
    method: 'GET',
    url: 'https://tempmail.plus/api/mails/'+Cypress.env('mail_id')+'?email='+email+'&epin=',
    failOnStatusCode: false,
  }).as('tempMail#2')
  .then((response) =>{
    expect(response.status).to.eq(200)
    Cypress.env('updatePassUrl', response.body.text.split('( ')[1].split(' )')[0])
  })
})

Cypress.Commands.add('createLesson', (title, id_group, id_lesson) => {    // Создание урока
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/lessons", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "groupId": Cypress.env(id_group),
      "title": title,
      "lessonTimestamp": "2025-11-19T09:07:25.028Z"
    }
  }).as('createLesson')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_lesson, response.body.id)
  })
})

Cypress.Commands.add('deleteLesson', (id_lesson) => {    // удаление урока
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/lessons/"+Cypress.env(id_lesson), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('deleteLesson')
  .then((response) =>{
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('createTask', (title, id_lesson, id_task) => {    // Создание задания
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/tasks",
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "type": "classwork",
      "isVisible": true,
      "title": title,
      "studentId":null,
      "lessonId": Cypress.env(id_lesson),
    }
  }).as('createTask')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_task, response.body.id)
  })
})

Cypress.Commands.add('createHomeworkTask', (title, id_lesson, id_task) => {    // Создание домашнего задания
  cy.request({
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/lessons/"+Cypress.env(id_lesson)+"/task",
    failOnStatusCode: false,
    headers: {
      'Authorization': 'Bearer '+ Cypress.env('accessToken'),
    },
    body:{
      title: title,
      type: "homework"
    }
  }).as('createTask')
      .then((response) =>{
        expect(response.status).to.eq(201)
        Cypress.env(id_task, response.body.id)
      })
})

Cypress.Commands.add('createParentFolder', ( id_parentFolder) => {    // Создание папки
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/folders",
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
        "title": "ParentFolder"
    }
  }).as('createParentFolder')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_parentFolder, response.body.id)
  })
})

Cypress.Commands.add('deleteParentFolder', (id_parentFolder) => {    // Удаление папки
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/folders/"+Cypress.env(id_parentFolder), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
  }).as('deleteParentFolder')
  .then((response) =>{
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('clickDeleteFolders', () => {

  cy.contains('Создание папки')
  .parents('div[role="dialog"]')
  .find('svg[data-testid="CloseIcon"]')
  .click()

  cy.get('p')
        .contains('Папка 2')
        .click()
        cy.wait(1000)

  cy.contains('fo')
  .parent()
  .parent()
  .find('svg[data-testid="MoreVertIcon"]')
  .click()
  
  cy.get('ul>li:last-child')
  .find('Удалить папку')
  .click()

  cy.contains('Удалить папку')
  .click()

  cy.wait('@matchedDeleteSubject').then(({response}) =>{
      expect(response.statusCode).to.eq(200)
  })
  
  

  cy.contains('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')
  .parent()
  .parent()
  .find('svg[data-testid="MoreVertIcon"]')
  .click()
  
  cy.get('ul[role="menu"]')
  .find('Удалить папку')
  .click()

  cy.contains('Удалить папку')
  .click()

  cy.wait('@matchedDeleteSubject').then(({response}) =>{
      expect(response.statusCode).to.eq(200)
  })
})

Cypress.Commands.add('deleteTask', (id_task, id_lesson) => {    // удаление задания
  cy.request({ 
    method: 'DELETE',
    url: Cypress.env('newPlatformApiUrl')+"/lessons/"+Cypress.env(id_lesson)+"/task/"+Cypress.env(id_task), 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      }
  }).as('deleteTask')
  .then((response) =>{
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('createBlockImage', (title, id_task, id_block) => {    // Создание блока изображения
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/tasks/"+Cypress.env(id_task)+"/block/image", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "src": Cypress.env('imageBlock'),
      "title": title,
      "isCopyrightHolder": true,
      "copyrightUrl": Cypress.env('imageBlock'),
      "isAuthor": true,
      "author": "true",
      "position": 3,
      "isVisible": true
    }
  }).as('createBlockImage')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_block, response.body.id)
  })
})

Cypress.Commands.add('createBlockVideo', (title, id_task, id_block) => {    // Создание видео блока
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/tasks/"+Cypress.env(id_task)+"/block/video", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "transcript": "transcript",
      "copyrightUrl": Cypress.env('videoBlock'),
      "src": Cypress.env('videoBlock'),
      "title": title,
      "isCopyrightHolder": true,
      "isAuthor": true,
      "author": "true",
      "preview": 5.532,
      "position": 3,
      "isVisible": true,
      "accessTranscript": true,
      "fragmentation": [
        {
          "start": 1,
          "end": 2
        },
        {
          "start": 1,
          "end": 2
        }
      ]
    }
  }).as('createBlockVideo')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_block, response.body.id)
  })
})

Cypress.Commands.add('createBlockText', (title, id_task, id_block) => {    // Создание текстового блока
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/tasks/"+Cypress.env(id_task)+"/block/text", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "text": Cypress.env('textBlock'),
      "title": title,
      "isCopyrightHolder": true,
      "isAuthor": true,
      "position": 3,
      "isVisible": true
    }
  }).as('createBlockText')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_block, response.body.id)
  })
})

Cypress.Commands.add('createSlider', (title, id_task) => {    // Создание слайдера
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/block/slider", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "title": title,
      "task": "task one",
      "duration": 60,
      "text": "text one"
    }
  }).as('createTask')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_task, response.body.id)
  })
})

Cypress.Commands.add('createExercise', (title, id_task, id_block) => {    // Создание упражнения
  cy.request({ 
    method: 'POST',
    url: Cypress.env('newPlatformApiUrl')+"/tasks/"+Cypress.env(id_task)+"/block/exercise", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      "text": "text one",
      "exerciseType": "singleChoice",
      "sliderId": "61fe2e30-0164-4205-a21c-20b1950a7328",
      "mediaId": "61fe2e30-0164-4205-a21c-20b1950a7328",
      "hint": "hello is one",
      "duration": 23,
      "position": 5,
      "isVisible": true
    }
  }).as('createBlockText')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_block, response.body.id)
  })
})

Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fixturePath, mimeType) => {
  cy.fixture(fixturePath, 'base64').then(content => {
    Cypress.Blob.base64StringToBlob(content, mimeType).then((blob) => {
      const testfile = new File([blob], fixturePath, { type: mimeType });
      const dataTransfer = new DataTransfer();
      const fileInput = subject[0];

      dataTransfer.items.add(testfile);
      fileInput.files = dataTransfer.files;

      cy.wrap(subject).trigger('change', { force: true });
    });
  });
})








