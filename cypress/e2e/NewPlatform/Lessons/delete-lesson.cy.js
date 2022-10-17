describe('Delete Lesson', () => {

    before('Очищаю предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
        cy.createLesson('test_lesson', 'id_group', 'id_lesson')
         
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

        cy.intercept({
            method: 'DELETE',
            url: '**/lessons/**'
        }).as('matchedDeleteLesson')                            

        cy.visitGroup('id_group')
        cy.wait('@matchedAuth')


        cy.contains('test_lesson')
        .parent().parent()
        .find('svg[data-testid="EditIcon"]')
        .wait(1000)
        .click()
        .wait(1000)          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - удаление урока', () => {

        cy.contains('Удалить урок')
        .click()
        .wait(1000)

        cy.contains('Вы действительно хотите удалить')
        .parents('form')
        .find('button')
        .wait(1000)
        .click()

        cy.wait('@matchedDeleteLesson').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.message).to.eq('Урок успешно удалён')
        })

        cy.contains('Урок успешно удалён!')
        .should('exist')
    
    })
})