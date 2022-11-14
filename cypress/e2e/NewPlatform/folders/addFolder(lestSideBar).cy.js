describe('Add folder', () => {


    beforeEach( () => {
        cy.login();
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        

        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/folders',
          }).as('matchedFolder')          
          
        // cy.intercept({
        //     method: 'DELETE',
        //     url: '**/folders/**',
        //   }).as('matchedDeleteFolders')   //для будущих поколений
          
        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.get('p')
        .contains('Моё')
        .click()
        cy.wait(1000)

        cy.get('svg[data-testid="AddIcon"]')
        .eq(0)
        .parent()
        .click()
        .wait(1000)
    })
    

    it.skip('Основной сценарий - 2 символа', () => {
        
        cy.get('input[name="folderTitle"]')
        .type('fo')
        .should('have.value', 'fo')

        cy.get('button')
        .contains('Создать папку')
        .click()

        cy.wait('@matchedFolder').then(({response}) =>{
            expect(response.statusCode).to.eq(201)
        })
    
        cy.contains('Папка fo сохранена')
        .should('exist')
        
    })

    it.skip('Альтернативный сценарий - 100 символов', () => {
        
        cy.get('input[name="folderTitle"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')
        .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')

        cy.get('button')
        .contains('Создать папку')
        .click()

        cy.wait('@matchedFolder').then(({response}) =>{
            expect(response.statusCode).to.eq(201)
        })
    
        cy.contains('Папка Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut сохранена')
        .should('exist')
    })

    it.skip('Пустые поля', () => {

        cy.get('button')
        .contains('Создать папку')
        .click()
    
        cy.contains('Необходимо задать название папки')
        .should('exist')
    })

    it.skip('Максимальное кол-во символов', () => {
        cy.get('input[name="folderTitle"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')
        .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')

        cy.get('button')
        .contains('Создать папку')
        .click()
    
        cy.contains('Введите не более 100 символов')
        .should('exist')
    })

    it('Повторяющееся название урока', () => {
        // cy.get('input[name="folderTitle"]')
        // .type('fo')
        // .should('have.value', 'fo')

        // cy.get('button')
        // .contains('Создать папку')                                                       //нужно фиксить, тут баг
        // .click()
    
        // cy.contains('Данное название папки уже имеется')
        // .should('exist')




        // cy.contains('Создание папки')
        // .parents('div[role="dialog"]')
        // .find('svg[data-testid="CloseIcon"]')
        // .click()

        // cy.contains('fo')
        // .parent()
        // .parent()
        // .find('svg[data-testid="MoreVertIcon"]')
        // .click()
        
        // cy.contains('Удалить предмет')
        // .click()

        // cy.contains('Удалить папку')
        // .click()

        // cy.wait('@matchedDeleteSubject').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })
        
        cy.clickDeleteFolders()

        cy.contains('fo').should('not.exist')


        // cy.contains('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')
        // .parent()
        // .parent()
        // .find('svg[data-testid="MoreVertIcon"]')
        // .click()
        
        // cy.contains('Удалить папку')
        // .click()

        // cy.contains('Удалить папку')
        // .click()

        // cy.wait('@matchedDeleteSubject').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })
        
        cy.contains('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ').should('not.exist')
    })
})