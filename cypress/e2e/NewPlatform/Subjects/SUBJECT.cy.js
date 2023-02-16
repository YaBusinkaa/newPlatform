describe('Subjects creating testing', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test')
        cy.deleteAfterSubject('id_subject')
    })


    beforeEach( () => {
        cy.login()
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/subjects',
          }).as('matchedUrl')                           // Перехватываем post запрос login

          cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrlCount')    
        cy.visit(Cypress.env('newPlatformUrl'))
        cy.wait('@matchedUrlCount').then(({response}) =>{
            expect(response.statusCode).to.eq(200)
        })

    })
    it('Основной сценарий', () => {
        cy.contains('Создать предмет').wait(500)
        .click()

        cy.get('input[name="newSubject"]')
        .type('test')
        .should('have.value', 'test')

        cy.contains('Добавить предмет').wait(500)
        .click()

        cy.wait('@matchedUrl').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq("test")
            Cypress.env('id_subject',response.body.id)
        })
        
        cy.contains('Предмет успешно создан!')
        .should('exist')

        cy.deleteSubject('id_subject')
    })

    it('Пустые поля', () => {
        cy.contains('Создать предмет').wait(500)
        .click()

        cy.contains('Добавить предмет').wait(500)
        .click()

        
        cy.contains('Заполните название предмета')
        .should('exist')

    })

it('Максимальное количество символов', () => {
        cy.contains('Создать предмет').wait(500)
        .click()

        cy.get('input[name="newSubject"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet doloшre magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex')

        cy.contains('Добавить предмет').wait(500)
        .click()
        
        cy.contains('Введите символы в промежутке от 1 до 250 символов')
        .should('exist')

    })

    it('Предмет с таким названием существует', () => {

        cy.createSubject('test','id_subject')
        cy.contains('Создать предмет').wait(500)
        .click()

        cy.get('input[name="newSubject"]')
        .type('test')

        cy.contains('Добавить предмет').wait(500)
        .click()
        
        cy.contains('Данное название предмета уже имеется, введите другое название')
        .should('exist')

        cy.deleteSubject('id_subject')

    })


}) 