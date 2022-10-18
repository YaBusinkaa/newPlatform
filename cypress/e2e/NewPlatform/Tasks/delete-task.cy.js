describe('Delete Task', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    }) 


    beforeEach( () => {
        cy.login()
        cy.createSubject('testSubject','id_subject')
        cy.createGroup('testGroup','id_subject','id_group')
        cy.createLesson('testLesson','id_group','id_lesson')
        cy.createTask('test_task', 'id_lesson','id_task')    

        
        cy.intercept({
            method: 'DELETE',
            url: '**/task/**'
        }).as('matchedDeleteTask')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.visitGroup('id_subject','id_group')

        
        cy.wait('@matchedAuth') 

        // cy.contains('testLesson')
        // .parent().parent()
        // .find('label')
        // .wait(1000)
        // .click()
        // .wait(1000)

        cy.contains('testLesson')
        .parent().parent().parent()
        .find('svg[data-testid="KeyboardArrowDownIcon"]')
        .wait(1000)
        .click()
        .wait(1000)
    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it('Основной сценарий - удаление классной работы', () => {

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="DeleteIcon"]')
            .click()

        cy.contains('Удалить задание')
            .parents('form')
            .find('button')
            .click()

        cy.wait('@matchedDeleteTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Задание успешно удалено')
            .should('exist')
    })

    it('Отмена удаления классной работы', () => {

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="DeleteIcon"]')
            .click()

        cy.contains('Вы действительно хотите удалить задание')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="CloseIcon"]')
            .click()
            .wait(500)

    })
})