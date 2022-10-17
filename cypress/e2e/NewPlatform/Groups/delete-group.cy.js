describe('edit-group(mainPage)', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })
    
    beforeEach(() => {
        cy.login()
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
        }).as('matchedUrl')
          
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

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

        cy.contains('test_subject')
        .parent().parent()
        .find('label')
        .click()

        cy.contains('Группа test_group')
        .parent()
        .find('a')
        .click()
        
        cy.wait('@matchedGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.title).to.eq('test_group')
            expect(response.body.id).to.eq(Cypress.env('id_group'))
        })

        cy.get('svg[data-testid="EditIcon"]')
        .parents('button')
        .click()
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })

    it('Основной сценарий удаления группы',()=>{

        cy.contains('Удалить группу test_group')
        .wait(2000)
        .click({force:true})

        cy.contains('Вы действительно хотите удалить всю')
        .should('exist')

        cy.contains('Вы действительно хотите удалить всю')
        .parents('form')
        .find('button')
        .wait(2000)
        .click()


        cy.wait('@matchedDeleteGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.message).to.eq('Группа успешно удалена')
        })

        cy.contains('Группа успешно удалена!')
        .should('exist')
        
    })

})