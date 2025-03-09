package edu.icet.mosback.controller;


import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import edu.icet.mosback.dto.LoginRequest;
import edu.icet.mosback.dto.SingupRequest;
import edu.icet.mosback.entity.User;
import edu.icet.mosback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public boolean signup(@RequestBody SingupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(signupRequest.getPassword());
        user.setEmail(signupRequest.getEmail());

        User registeredUser = userService.registerUser(user);
        if(registeredUser==null){
           return false;
        }else{
            String apiKey = "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";
            String templateId = "d-3f49798d3adb496db02e99d5eae495b1";
            String fromEmail = "miniduminidu100@gmail.com";
            String toEmail = user.getEmail(); // Get recipient email

            String memberName = user.getEmail();
            if (memberName.isEmpty()) memberName = "Member";

            Email from = new Email(fromEmail);
            Email to = new Email(toEmail);
            Mail mail = new Mail();
            mail.setFrom(from);
            mail.setTemplateId(templateId);

            Personalization personalization = new Personalization();
            personalization.addTo(to);

            personalization.addDynamicTemplateData("name", memberName);
            personalization.addDynamicTemplateData("message", "Thanks For Using Book Bridge! Come Again");

            mail.addPersonalization(personalization);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            try {
                request.setMethod(Method.POST);
                request.setEndpoint("mail/send");
                request.setBody(mail.build());
                Response response = sg.api(request);


            } catch (IOException e) {

            }
            return true;
        }
    }

    @PostMapping("/login")
    public boolean login(@RequestBody LoginRequest loginRequest) {
       return userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
    }
}
