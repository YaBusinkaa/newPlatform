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
    Cypress.env('id_user', response.body.id)
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
    url: Cypress.env('newPlatformApiUrl')+"/lessons/"+Cypress.env(id_lesson)+"/task", 
    failOnStatusCode: false,
    headers: { 
        'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
      },
    body:{
      title: title,
      type: "classwork"
    }
  }).as('createTask')
  .then((response) =>{
    expect(response.status).to.eq(201)
    Cypress.env(id_task, response.body.id)
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








