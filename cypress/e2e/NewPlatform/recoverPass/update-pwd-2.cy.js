describe('Recover password validation testing', () => {

    before(()=>{
        cy.login()
        cy.getUser(Cypress.env('tempEmailTeacher'))                
        cy.deleteUser()                                     // удаляем юзера
        cy.createUser(Cypress.env('tempEmailTeacher'))         // создаем юзера
        cy.wait(2000)

        cy.tempMailId(Cypress.env('tempEmailTeacher'))          // чистим сообщения
        cy.deleteTempMails(Cypress.env('tempEmailTeacher'))

        cy.request({ 
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+"/auth/recover-pwd", 
            failOnStatusCode: false,
            body: { 
                'email': Cypress.env('tempEmailTeacher'),       
              },
          }).as('recoverPass')
        .then((resp) =>{
            expect(resp.status).to.eq(201)
        })

        cy.wait(2000)
        cy.tempMailRecoveryId(Cypress.env('tempEmailTeacher'))
        cy.tempMailRecoveryCode(Cypress.env('tempEmailTeacher'))
        cy.clearCookies()
    })

    beforeEach( () => {
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/auth/update-pwd',
          }).as('matchedUrl')                   // Перехватываем post запрос login

        cy.visit(Cypress.env('updatePassUrl'))
        cy.wait(2000)

    })

    after(()=>{
        cy.deleteUser()
        cy.tempMailId(Cypress.env('tempEmailTeacher'))
        cy.deleteTempMails(Cypress.env('tempEmailTeacher'))
    })

    
    it('Пустые поля', () => {
        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Поле пароля не должно быть пустым')
        .should('exist')
        cy.contains('Подтведите пароль')
        .should('exist')
    })

    it('Новый пароль совпадает с текущим', () => {

        cy.get('input[name="password"]')
        .type('testtest')
        .should('have.value', 'testtest')

        cy.get('input[name="passwordRepetition"]')
        .type('testtest')
        .should('have.value', 'testtest')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Новый пароль совпадает со старым')
        .should('exist')
    })

    it('Пароли не совпадают', () => {

        cy.get('input[name="password"]')
        .type('testtest')
        .should('have.value', 'testtest')

        cy.get('input[name="passwordRepetition"]')
        .type('testtestt')
        .should('have.value', 'testtestt')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Пароли не совпадают, повторите попытку')
        .should('exist')
    })


    it('Невалидные данные (кириллица)', () => {

        cy.get('input[name="password"]')
        .type('абвгдееее')
        .should('have.value', 'абвгдееее')

        cy.get('input[name="passwordRepetition"]')
        .type('абвгдееее')
        .should('have.value', 'абвгдееее')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
    })

    it('Невалидные данные (недопустимые символы)', () => {

        cy.get('input[name="password"]')
        .type('@.passwor!')
        .should('have.value', '@.passwor!')

        cy.get('input[name="passwordRepetition"]')
        .type('@.passwor!')
        .should('have.value', '@.passwor!')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
    })

    it('Минимальное кол-во символов', () => {

        cy.get('input[name="password"]')
        .type('dd')
        .should('have.value', 'dd')

        cy.get('input[name="passwordRepetition"]')
        .type('dd')
        .should('have.value', 'dd')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов')
        .should('exist')
    })

    it('Основной сценарий', () => {
        cy.get('input[name="password"]')
        .type('testtesttest')
        .should('have.value', 'testtesttest')

        cy.get('input[name="passwordRepetition"]')
        .type('testtesttest')
        .should('have.value', 'testtesttest')

        cy.contains('СОХРАНИТЬ')
        .click()

        cy.wait('@matchedUrl').then(({response})=>{
            expect(response.statusCode).to.eq(201)
        })

        cy.request({      // проверяем изменение пароля, путем отправки запроса на сервер
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+"/auth/login",  
            failOnStatusCode: false,
            body: {
              "email": Cypress.env("tempEmailTeacher"),                  
              "password": "testtesttest"             
            },
        }).then((response)=>{
            expect(response.status).to.eq(201)
        })

    })

})