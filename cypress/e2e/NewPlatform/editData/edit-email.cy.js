describe('Edit email', () => {

    beforeEach(() => {
        cy.login();
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        
        cy.intercept({
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+'/users/me/email'      // Перехватываем запрос смены Email
        }).as('matchedChangeEmail')
        cy.visit(Cypress.env('newPlatformUrl'))
    })


    it('Основной сценарий', () => {

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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type(Cypress.env('newEmail'))
        .should('have.value', Cypress.env('newEmail'))
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
        .invoke('attr', 'type')
        .should('eq', 'password')
        
        cy.get('input[name="password"]').eq(1)
        .parent()
        .find('svg[data-testid="VisibilityOffIcon"]')
        .click()

        cy.get('input[name="password"]').eq(1)
        .invoke('attr', 'type')
        .should('eq', 'text')

        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()
        

        cy.wait('@matchedChangeEmail').then(({response}) => {   // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
            expect(response.body.email).to.eq(Cypress.env('newEmail'))   // Проверка ответа от сервера
        })

        cy.contains('E-mail изменен')
        .should('exist')

        cy.request({      // проверяем изменение email, путем отправки запроса на сервер
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+"/auth/login",  
            failOnStatusCode: false,
            body: {
              "email": Cypress.env("email"),                  
              "password": Cypress.env("pass")              
            },
        })
        .its('status')
        .should('eq', 404)
        cy.wait(2000)
        
        cy.get('input[name="emailHidden"]')
        .should('have.value', Cypress.env('newEmail'))

        cy.request({      // ИЗМЕНЯЕМ ОБРАТНО ИМЕЙЛ НА СТАРЫЙ
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+"/users/me/email", 
            failOnStatusCode: false,
            headers: { 
                'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
              },
            body: {
              "email": Cypress.env("email"),                   
              "password": Cypress.env("pass")              
            },
        })
        .its('status')
        .should('eq', 200)  
    })

    it('Пустые поля', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите новую электронную почту')
        .should('exist')

        cy.contains('Поле "Текущий пароль" не должно быть пустым')
        .should('exist')
    })

    it('Неверный текущий пароль', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type(Cypress.env('newEmail'))
        .should('have.value', Cypress.env('newEmail'))
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('badPass'))
        .should('have.value', Cypress.env('badPass'))
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Неверный пароль')
        .should('exist')
    })

    it('Новая почта уже существует', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type(Cypress.env('emailAlreadyExist'))
        .should('have.value', Cypress.env('emailAlreadyExist'))
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Такой email уже существует')
        .should('exist')
    })

    it('Невалидные данные (кириллица)', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type('ауфафуауф@gmail.com')
        .should('have.value', 'ауфафуауф@gmail.com')
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')

    })

    it('Невалидные данные (недопустимые символы)', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type('abc:)@gmail.com')
        .should('have.value', 'abc:)@gmail.com')
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')
    })

    it('Невалидные данные (пробел)', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type('abc @gmail.com')
        .should('have.value', 'abc @gmail.com')
    
        cy.get('input[name="password"]').eq(1)
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите корректный E-mail')
        .should('exist')
    })

    it('Минимальное кол-во символов', () => {
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

        cy.contains('Изменить электронную почту')
        .click()

        cy.get('input[name="email"]')
        .type('a@m.ru')
        .should('have.value', 'a@m.ru')
    
        cy.get('input[name="password"]').eq(1)
        .type('eafgrgrgra')
        .should('have.value', 'eafgrgrgra')
        
        cy.get('input[name="email"]')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Email должен быть не короче 9 символов')
        .should('exist')

    })
})