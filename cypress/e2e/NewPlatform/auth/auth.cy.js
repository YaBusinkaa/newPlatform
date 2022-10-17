describe('Authorization validation testing', () => {

    beforeEach( () => {
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/auth/login',
          }).as('matchedUrl')                           // Перехватываем post запрос login

        cy.visit(Cypress.env('newPlatformUrl'))
    })

    it('Основной сценарий', () => {
        cy.get('input[name="email"]')
        .type(Cypress.env('email'))
        .should('have.value', Cypress.env('email'))

        cy.get('input[name="password"]')
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))

        cy.get('[data-testid="VisibilityOffIcon"]')
        .click()
        
        cy.get('input[name="password"]')  
        .invoke('attr', 'type')
        .should('eq', 'text')

        cy.get('button')
        .find('span').contains('Войти')
        .click()

        cy.wait('@matchedUrl').then(({response}) => {           // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Здравствуйте, Ivan') 
        .should('exist')

    })

    it.skip('Пустые поля', () => {

        cy.get('button')
        .contains('Войти')
        .click()

        cy.contains('Поле E-mail не должен быть пустым') 
        .should('exist')

        cy.contains('Поле пароля не должен быть пустым') 
        .should('exist')
    })

    it.skip('Не зарегистрированный email', () => {

        cy.get('input[name="email"]')
        .type('ipst@yan.ru')
        .should('have.value', 'ipst@yan.ru')

        cy.get('input[name="password"]')
        .type('testpassword')
        .should('have.value', 'testpassword')
  
        cy.get('button')
        .contains('Войти')
        .click()

        cy.wait('@matchedUrl').then(({response}) => {           // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(404)
            expect(response.body.message).eq('Пользователя с таким email не существует') // проверяем статус код и ответ на сервере
        })

        cy.contains('Пользователя с таким email не существует')
        .should('exist')
    })

    it.skip('Неверный пароль', () => {

        cy.get('input[name="email"]')
        .type(Cypress.env('email'))
        .should('have.value', Cypress.env('email'))

        cy.get('input[name="password"]')
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass'))
  
        cy.get('button')
        .contains('Войти')
        .click()

        cy.wait('@matchedUrl').then(({response}) => { // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(403)
            expect(response.body.message).eq('Неверный email или пароль') // проверяем статус код и ответ на сервере
        })

        cy.contains('Неверный email или пароль')
        .should('exist')
    })

    it.skip('Невалидные данные', () => {

        cy.get('input[name="email"]')
        .type('еуы@@@@е@gmail.com')
        .should('have.value', 'еуы@@@@е@gmail.com')

        cy.get('input[name="password"]')
        .type('йцукен123')
        .should('have.value', 'йцукен123')

        cy.get('button')
        .contains('Войти')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')

        cy.contains('Неверный email или пароль') 
        .should('exist')
    })

    it.skip('Невалидные данные (пробел)', () => {

        cy.get('input[name="email"]')
        .type('test ipst@gmail.com')
        .should('have.value', 'test ipst@gmail.com')

        cy.get('input[name="password"]')
        .type('qwerty 123')
        .should('have.value', 'qwerty 123')

        cy.get('button')
        .contains('Войти')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')

    })

    it.skip('Минимальное кол-во символов', () => {

        cy.get('input[name="email"]')
        .type('na@al.cm')
        .should('have.value', 'na@al.cm')

        cy.get('input[name="password"]')
        .type('qwe')
        .should('have.value', 'qwe')

        cy.get('button')
        .contains('Войти')
        .click()

        cy.contains('Минимум 9 символов')
        .should('exist')
        cy.contains('Минимум 8 символов') 
        .should('exist')
    })
})
