Feature:
    Users should be able to login using a form.
    
    Scenario: A guest should be able to login and become a user.
        Given I am on the login page
        And I am not logged in
        When I fill in the data of the example user
        And click login
        Then I should see the dashboard.
    
    Scenario: A guest should get an error message when he enters the wrong credentials.
        Given I am on the login page
        And I am not logged in
        When I fill in "wrongUserName" in username
        And I fill in "absoluteNonsensePassword" in password
        And click login
        Then I should see "Error"