describe('Add group to Sub', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
       
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createSubject('copy_subject', 'id_subjectCopy')
        cy.createGroup('test_group', 'id_subjectCopy', 'id_group')
        cy.createGroup('copyGroup', 'id_subject', 'id_group')

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
        
        cy.intercept({
            method: 'POST',
            url: '**/groups**'
        }).as('matchedAddGroup') 

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
        cy.deleteSubjectCopy('id_subjectCopy')
    })


    it.skip('Основной сценарий - Добавление существующей группы', () => {

        cy.contains('Добавить существующую группу')
        .click()

        cy.get('input[name="existGroup"]')
        .type('test_gro')
        .should('have.value', 'test_gro')

        cy.get('ul>li>ul')          //очень плохо, надо переделать
        .click()

        cy.contains('Добавление существующей группы')
        .parents('form')
        .find('button')
        .click()
    
        cy.contains('Группа успешно добавлена!')
        .should('exist')

        // cy.contains('Группа test_group')
        // .parent()
        // .find('a')
        // .click()

        // cy.wait('@matchedAuth').then(({response})=>{
        //     expect(response.statusCode).to.eq(200)
        // })

        // cy.url()
        // .should('include', '/group/')

        // cy.contains('Группа test_group')
        // .should('exist')

        // cy.contains('test_subject')
        // .should('exist')

        //cy.deleteGroup('id_group')
    
    })

   
    it.skip('Добавление несуществующей группы', () => {

        cy.contains('Добавить существующую группу')
        .click()

        cy.get('input[name="existGroup"]')
        .type('абоба')
        .should('have.value', 'абоба')

        cy.contains('Добавление существующей группы')
        .parents('form')
        .find('button')
        .should('be.disabled')
    })


    // it('Повторяющийся номер группы', () => {

    //     cy.contains('Добавить существующую группу')
    //     .click()

    //     cy.get('input[name="existGroup"]')                                                //нужно полностью сделать нормальный тест с нуля, ибо это не работает и я не знаю как сделать рабочий
    //     .type('test_group')
    //     .should('have.value', 'test_group')


    //     cy.get('ul>li>ul')          //очень плохо, надо переделать
    //     .click()

    //     cy.get('p')
    //     .contains('Добавление существующей группы')
    //     .parent()
    //     .find('button')
    //     .click()

    //     cy.get('p')
    //     .contains('Добавление существующей группы')
    //     .parent()
    //     .parent()
    //     .find('[data-testid="CloseIcon"]')
    //     .click()


    //     cy.contains('test_subject')
    //     .parent().parent().parent()
    //     .find('svg[data-testid="AddCircleOutlineIcon"]')
    //     .parents('button')
    //     .click()

    //     cy.get('input[name="existGroup"]')
    //     .type('test_group')
    //     .should('have.value', 'test_group')

    //     cy.get('ul>li>ul')          //очень плохо, надо переделать
    //     .click()

    //     cy.contains('test_subject')
    //     .parent().parent()
    //     .find('label')
    //     .click()
    
    //     cy.contains('Добавление существующей группы')
    //     .parents('form')
    //     .find('button')
    //     .click()

    //     cy.contains('Данный номер группы уже имеется, введите другой номер')
    //     .should('exist')

    // })
})