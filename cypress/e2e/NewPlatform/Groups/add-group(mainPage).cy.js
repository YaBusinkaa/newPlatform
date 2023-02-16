describe('Add group', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
        }).as('matchedUrl')
          
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

        cy.intercept({
            method: 'POST',
            url: '**/groups**'
        }).as('matchedCreateGroup')                            

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.contains('test_subject')
        .parent().parent()
        .find('label')
        .click()

        cy.contains('test_subject')
        .parent().parent().parent()
        .find('svg[data-testid="AddCircleOutlineIcon"]')
        .parents('button')
        .click()
          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - создание новой группы', () => {
        cy.get('input[name="newGroup"]')
        .type('test_group')
        .should('have.value', 'test_group')

        cy.contains('Создание новой группы')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateGroup').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_group')
            expect(response.body.subjectId).to.eq(Cypress.env('id_subject'))
            Cypress.env('id_group', response.body.id)
        })
    
        cy.contains('Группа успешно создана!')
        .should('exist')

        cy.contains('Группа test_group')
        .parent()
        .parent()
        .find('a')
        .click()

        cy.wait('@matchedAuth').then(({response})=>{
            expect(response.statusCode).to.eq(200)
        })

        cy.url()
        .should('include', '/group/')

        cy.contains('Группа test_group')
        .should('exist')

        cy.contains('test_subject')
        .should('exist')

        cy.deleteGroup('id_group')
    
    })

   
    it('Пустые поля', () => {

        cy.contains('Создание новой группы')
        .parents('form')
        .find('button')
        .click()
    
        cy.contains('Заполните номер группы')
        .should('exist')
    })

    it('Максимальное кол-во символов', () => {
        cy.get('input[name="newGroup"]')
        .type('123456789012345678901234567890123456789012345678900')
        .should('have.value', '123456789012345678901234567890123456789012345678900')

        cy.contains('Создание новой группы')
        .parents('form')
        .find('button')
        .click()
    
        cy.contains('Введите не более 50 символов')
        .should('exist')
    })

    it('Повторяющийся номер группы', () => {
        cy.createGroup('test_group', 'id_subject', 'id_group')

        cy.get('input[name="newGroup"]')
        .type('test_group')
        .should('have.value', 'test_group')

        cy.contains('Создание новой группы')
        .parents('form')
        .find('button')
        .click()
    
        cy.contains('Данный номер группы уже имеется, введите другой номер')
        .should('exist')

        cy.deleteGroup('id_group')
    })
})