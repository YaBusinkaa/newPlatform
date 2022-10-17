describe('Update Task', () => {

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
            method: 'PUT',
            url: '**/task**'
        }).as('matchedUpdateTask')

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


    it('Основной сценарий - редактирование классной работы', () => {

        cy.createTask('test_task', 'id_lesson', 'id_task')

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
        .clear()
        .type('test')
        .should('have.value', 'test')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.type).to.eq('classwork')
        })

        cy.contains('Изменения сохранены!')
        .should('exist')
    
    })

    it('Основной сценарий - редактирование домашней работы', () => {

        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')
        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()
            .type('test')
            .should('have.value', 'test')

        cy.contains('Домашним заданием')
            .click()

        cy.contains('Классной работой')
            .click()

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.type).to.eq('homework')
        })

        cy.contains('Изменения сохранены!')
            .should('exist')

    })

    it('Пустые поля', () => {
        cy.createTask('test_task', 'id_lesson', 'id_task')
        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Необходимо заполнить поле')
        .should('exist')
    })

    it('Максимальное кол-во символов классная работа', () => {
        cy.createTask('test_task', 'id_lesson', 'id_task')
        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()
            .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите символы в промежутке от 1 до 250 символов')
        .should('exist')
    })

    it('Максимальное кол-во символов домашняя работа', () => {
        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')
        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()
            .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
            .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите символы в промежутке от 1 до 250 символов')
            .should('exist')
    })

    it('Минимальное кол-во символов классная работа', () => {
        cy.createTask('test_task', 'id_lesson', 'id_task')

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()
            .type('1')
            .should('have.value', '1')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите символы в промежутке от 1 до 250 символов')
            .should('exist')
    })

    it('Минимальное кол-во символов домашняя работа', () => {
        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.get('input[name="title"]')
            .clear()
            .type('1')
            .should('have.value', '1')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите символы в промежутке от 1 до 250 символов')
            .should('exist')
    })

    it('Название урока уже используется', () => {

        cy.contains('test_task')
            .parent()
            .parent()
            .parent()
            .find('[data-testid="EditIcon"]')
            .click()

        cy.createTask('test', 'id_lesson', 'id_task')
        cy.createHomeworkTask('test_task', 'id_lesson', 'id_task')

        cy.get('input[name="title"]')
        .clear()
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Данное название задания уже имеется, введите другое название')
        .should('exist')
    })


})