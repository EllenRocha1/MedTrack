package com.medtrack.medtrack.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = TelefoneValidoValidator.class)
@Target({ FIELD, PARAMETER, TYPE_USE, ANNOTATION_TYPE })
@Retention(RUNTIME)
public @interface TelefoneValido {

    String message() default "Telefone inválido. Use formato BR ou internacional válido.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
