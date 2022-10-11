describe('Delete student', () => {

    before('Очищаю предметы и студентов',() =>{
        cy.login()
        cy.getUser(Cypress.env('addStudentMail'))
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
        cy.deleteUser()
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
        cy.createStudent(Cypress.env('addStudentMail'), 'id_group')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
          }).as('matchedUrl')                          

          cy.intercept({
            method: 'GET',
            url: '**/groups/**',
          }).as('matchedGroups')
          
          cy.intercept({
            method: 'DELETE',
            url: '**/groups/**',
          }).as('matchedDeleteGroups')  

          cy.visit(Cypress.env('newPlatformUrl'))

          cy.wait('@matchedUrl')

          cy.contains('Предметы')
          .parent().parent().parent()
          .contains('test_subject')
          .click()

          cy.get('span').contains('test_group')
          .click()

          cy.wait('@matchedGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
          })

          cy.contains(Cypress.env('addStudentMail'))
          .wait(1000)
          .click()
          cy.wait(1000)

    })

    afterEach(()=>{
        cy.deleteGroup('id_group')
        cy.deleteSubject('id_subject')
        cy.getUser(Cypress.env('addStudentMail'))
        cy.deleteUser()
    })

    it('Delete student', () =>{

        cy.contains('Удалить из группы test_group')
        .click()

        cy.wait('@matchedDeleteGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.message).to.eq('Пользователь успешно удален из группы')
        })

        cy.contains('Студент успешно удалён!')
        .should('exist')
    })
})