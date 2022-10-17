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
            method: 'PUT',
            url: '**/groups/**',
        }).as('matchedPutGroups') 
      
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
        cy.deleteGroup('id_group')
        cy.deleteSubject('id_subject')
    })

    it('Основной сценарий редактирования группы',()=>{
        cy.get('input[name="title"]')
        .clear()
        .type('edit_group')
        .should('have.value', 'edit_group')

        cy.contains('Сохранить изменения')
        .click()

        cy.wait('@matchedPutGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.title).to.eq('edit_group')
            expect(response.body.id).to.eq(Cypress.env('id_group'))
        })

        cy.contains('Изменения сохранены!')
        .should('exist')
    })

    it('Пустые поля',()=>{
        cy.get('input[name="title"]')
        .clear()

        cy.contains('Сохранить изменения')
        .click()

        cy.contains('Заполните номер группы')
        .should('exist')
    })

    it('Максимальное кол-во символов',()=>{
        cy.get('input[name="title"]')
        .clear()
        .type('123456789012345678901234567890123456789012345678900')
        .should('have.value', '123456789012345678901234567890123456789012345678900')

        cy.contains('Сохранить изменения')
        .click()

        cy.contains('Введите символы в промежутке от 1 до 50')
        .should('exist')
    })

    it('Повторяющийся номер группы',()=>{
        cy.createGroup('edit_group', 'id_subject', 'id_edit_group')

        cy.get('input[name="title"]')
        .clear()
        .type('edit_group')
        .should('have.value', 'edit_group')

        cy.contains('Сохранить изменения')
        .click()

        cy.contains('Данный номер группы уже имеется, введите другой номер')
        .should('exist')

        cy.deleteGroup('id_edit_group')
    })
})