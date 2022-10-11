describe('Recover password validation testing', () => {

    before(()=>{
        cy.login()
        cy.getUser(Cypress.env('tempEmailTeacher'))
        cy.deleteUser()
        cy.createUser(Cypress.env('tempEmailTeacher'))
        cy.clearCookie('user')
    })

    beforeEach( () => {
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/auth/recover-pwd',
          }).as('matchedUrl')                           // Перехватываем post запрос login

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.get('a').contains('Восстановить')
        .click()
    })

    after(()=>{
        cy.deleteUser()
    })

    it('Основной сценарий', () => {

        cy.get('input[name="email"]')
        .type(Cypress.env('tempEmailTeacher'))
        .should('have.value', Cypress.env('tempEmailTeacher'))

  
        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.wait('@matchedUrl').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.success).to.eq(true)
        })

        cy.contains('На указанный Email выслано письмо') 
        .should('exist')
    })

    it('Пустое поле', () => {

        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Поле E-mail не должен быть пустым') 
        .should('exist')
    })

    it('Неверный email', () => {

        cy.get('input[name="email"]')
        .type('ipst@yan.ru')
        .should('have.value', 'ipst@yan.ru')
  
        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Пользователя с таким email не существует') 
        .should('exist')
    })

    it('Невалидные данные (кириллица)', () => {

        cy.get('input[name="email"]')
        .type('еуые@gmail.com')
        .should('have.value', 'еуые@gmail.com')

        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')
    })

    it('Невалидные данные (недопустимые символы)', () => {

        cy.get('input[name="email"]')
        .type('test:)ipst@gmail.com')
        .should('have.value', 'test:)ipst@gmail.com')

        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')
    })

    it('Невалидные данные (пробел)', () => {

        cy.get('input[name="email"]')
        .type('test ipst@gmail.com')
        .should('have.value', 'test ipst@gmail.com')

        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')
    })

    it('Минимальное кол-во символов', () => {

        cy.get('input[name="email"]')
        .type('na@al.cm')
        .should('have.value', 'na@al.cm')
  
        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.contains('Минимум 9 символов') 
        .should('exist')
    })

    it('Вернуться на экран входа', () => {

        cy.contains('ВЕРНУТЬСЯ НА ЭКРАН ВХОДА')
        .click()

        cy.contains('Вход в систему') 
        .should('exist')
    })
})