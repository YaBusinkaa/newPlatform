describe('Edit password', () => {

    beforeEach( () => {
        cy.login();
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        
        cy.intercept({
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+'/users/me/password' // Перехватываем запрос смены пароля
        }).as('matchedChangePassword')

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl').then(({response}) => {   // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
        })

        cy.get('button[aria-controls="primary-search-account-menu"]')
        .click()

        cy.get('a')
        .contains('Профиль')
        .click()

        cy.wait('@matchedUrl').then(({response}) => {   // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Изменить пароль')
        .click()
    })

    it('Основной сценарий', () => { 

        cy.get('input[name="password"]').eq(0)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
    
        cy.get('input[name="newPassword"]') 
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass'))
  
        cy.get('input[name="passwordRepetition"]')
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass')) 

        cy.get('svg[data-testid="VisibilityOffIcon"]').eq(0)
        .click()

        cy.get('svg[data-testid="VisibilityOffIcon"]').eq(1)
        .click()

        cy.get('svg[data-testid="VisibilityOffIcon"]').eq(0)
        .click()

        cy.get('input[name="password"]').eq(0)
        .invoke('attr', 'type')
        .should('eq', 'text')

        cy.get('input[name="newPassword"]')
        .invoke('attr', 'type')
        .should('eq', 'text')

        cy.get('input[name="passwordRepetition"]')
        .invoke('attr', 'type')
        .should('eq', 'text')
        
        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedChangePassword').then(({response}) => {  // пока не завершится не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Пароль изменен')
        .should('exist')

        cy.request({      // проверяем изменение пароля, путем отправки запроса на сервер
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+"/auth/login",  
            failOnStatusCode: false,
            body: {
              "email": Cypress.env("email"),                  
              "password": Cypress.env("badPass")              
            },
        })
        .its('status')
        .should('eq', 201)

        cy.request({      // Меняем пароль обратно
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+"/users/me/password",  
            failOnStatusCode: false,
            headers: { 
                'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
              },
            body: {
                "password": Cypress.env("badPass"),
                "newPassword": Cypress.env("pass"),
                "passwordRepetition": Cypress.env("pass")         
            },
        })
        .its('status')
        .should('eq', 200)
    })

    it('Пустые поля', () => {
        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Поле "Текущий пароль" не должно быть пустым.')
        .should('exist')
        cy.contains('Поле "Новый пароль" не должно быть пустым.')
        .should('exist')
        cy.contains('Поле "Повтор нового пароля" не должно быть пустым.')
        .should('exist')
    })

    it('Неверный текущий пароль', () => {

        cy.get('input[name="password"]').eq(0)
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass'))
    
        cy.get('input[name="newPassword"]') 
        .type(Cypress.env('badPass')+'1')
        .should('have.value', Cypress.env('badPass')+'1')
  
        cy.get('input[name="passwordRepetition"]')
        .type(Cypress.env('badPass')+'1')
        .should('have.value', Cypress.env('badPass')+'1') 

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Неверный старый пароль') 
        .should('exist')
    })

    it('Новый пароль совпадает с текущим', () => {
        cy.get('input[name="password"]').eq(0)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
    
        cy.get('input[name="newPassword"]') 
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
  
        cy.get('input[name="passwordRepetition"]')
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass')) 

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Новый пароль совпадает с текущим')
        .should('exist')
    })

    it('Пароли не совпадают', () => {
        cy.get('input[name="password"]').eq(0)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
    
        cy.get('input[name="newPassword"]') 
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass'))
  
        cy.get('input[name="passwordRepetition"]')
        .type(Cypress.env('badPass')+'1')
        .should('have.value', Cypress.env('badPass')+'1') 

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Пароли не совпадают')
        .should('exist')
    })

    it('Невалидные данные (кириллица)', () => {

        cy.get('input[name="password"]').eq(0)
        .type('йцукен123')
        .should('have.value', 'йцукен123')
    
        cy.get('input[name="newPassword"]') 
        .type('йцукен1233')
        .should('have.value', 'йцукен1233')
  
        cy.get('input[name="passwordRepetition"]')
        .type('йцукен1233')
        .should('have.value', 'йцукен1233') 

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)')
        .should('exist')
    })

    it('Невалидные данные (недопустимые символы)', () => {

        cy.get('input[name="password"]').eq(0)
        .type('@.passwor!')
        .should('have.value', '@.passwor!')
    
        cy.get('input[name="newPassword"]') 
        .type('#pass><wor[')
        .should('have.value', '#pass><wor[')
  
        cy.get('input[name="passwordRepetition"]')
        .type('#pass><wor[')
        .should('have.value', '#pass><wor[')

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)')
        .should('exist')
    })

    it('Невалидные данные (пробел)', () => {

        cy.get('input[name="password"]').eq(0)
        .type('passwor dd')
        .should('have.value', 'passwor dd')
    
        cy.get('input[name="newPassword"]') 
        .type('new password')
        .should('have.value', 'new password')
  
        cy.get('input[name="passwordRepetition"]')
        .type('new password')
        .should('have.value', 'new password')

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)') 
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов (латинские буквы верхнего и нижнего регистра, цифру и знак)')
        .should('exist')
    })

    it('Минимальное кол-во символов', () => {
        
        cy.get('input[name="password"]').eq(0)
        .type('dd')
        .should('have.value', 'dd')
    
        cy.get('input[name="newPassword"]') 
        .type('new')
        .should('have.value', 'new')
  
        cy.get('input[name="passwordRepetition"]')
        .type('new')
        .should('have.value', 'new')

        cy.get('input[name="passwordRepetition"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Пароль должен содержать не менее 8 символов')
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов')
        .should('exist')
        cy.contains('Пароль должен содержать не менее 8 символов')
        .should('exist')
    })
})