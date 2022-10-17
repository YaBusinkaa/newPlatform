describe('Delete Task', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
        cy.createLesson('test_lesson', 'id_group', 'id_lesson')
        // cy.createTask('test_task', 'id_lesson', 'id_task')
        // cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')

        cy.intercept({
            method: 'GET',
            url: '**/groups/**',
        }).as('matchedUrl')
          
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

        cy.intercept({
            method: 'GET',
            url: '**/task**'
        }).as('matchedDeleteTask')

        cy.visitGroup('id_group')
        cy.wait('@matchedAuth')
        cy.wait(1000)

        cy.contains('test_lesson')
        .parent().parent()
        .find('label')
        .wait(1000)
        .click()
        .wait(1000)

        cy.contains('test_lesson')
        .parent().parent().parent()
        .find('svg[data-testid="KeyboardArrowDownIcon"]')
        .wait(1000)
        .click()
        .wait(1000)

         
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - удаление классной работы', () => {

        cy.createTask('test_task', 'id_lesson', 'id_task')

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

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Задание успешно удалено')
            .should('exist')
    
    })

    it('Основной сценарий - удаление домашней работы', () => {

        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')
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

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Задание успешно удалено')
            .should('exist')

    })

    it('Отмена удаления классной работы', () => {
        cy.createTask('test_task', 'id_lesson', 'id_task')

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="DeleteIcon"]')
            .click()

        cy.contains('test_task')
            .find('[data-testid="CloseIcon"]')
            .click()
    })

    it('Отмена удаления домашней работы', () => {
        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="DeleteIcon"]')
            .click()

        cy.contains('test_task')
            .find('[data-testid="CloseIcon"]')
            .click()
    })

})