"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	getAuthToken,
	register as registerUser,
	setAuthToken,
} from "@/lib/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { ApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [isRegistering, setIsRegistering] = useState(false);
	const [serverError, setServerError] = useState<string>("");

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
	});

	useEffect(() => {
		const token = getAuthToken();
		if (token) {
			router.push("/dashboard");
		}
	}, [router]);

	const onSubmit = async (data: RegisterFormData) => {
		setIsRegistering(true);
		setServerError("");

		try {
			const response = await registerUser(data.email, data.password);
			if (response.data.token) {
				setAuthToken(response.data.token);
				router.push("/dashboard");
			}
		} catch (error) {
			const apiError = error as ApiError;

			let errorMessage = "Error al crear la cuenta. Intenta de nuevo.";

			if (apiError.response?.data?.errors) {
				errorMessage = apiError.response.data.errors
					.map((e) => e.message)
					.join(", ");
			}

			setServerError(errorMessage);
		} finally {
			setIsRegistering(false);
		}
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Crear una cuenta</CardTitle>
				<CardDescription>
					Ingresa tu información a continuación para crear tu cuenta
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="m@ejemplo.com"
								{...formRegister("email")}
								aria-invalid={!!errors.email}
							/>
							{errors.email && (
								<p className="text-sm text-red-500 mt-1">
									{errors.email.message}
								</p>
							)}
						</Field>

						<Field>
							<FieldLabel htmlFor="password">
								Contraseña
							</FieldLabel>
							<Input
								id="password"
								type="password"
								{...formRegister("password")}
								aria-invalid={!!errors.password}
							/>
							{errors.password && (
								<p className="text-sm text-red-500 mt-1">
									{errors.password.message}
								</p>
							)}
						</Field>

						{serverError && (
							<div className="text-sm text-red-500 text-center">
								{serverError}
							</div>
						)}

						<FieldGroup>
							<Field>
								<Button
									type="submit"
									disabled={isRegistering || !isValid}
								>
									{isRegistering
										? "Creando cuenta..."
										: "Crear cuenta"}
								</Button>
								<FieldDescription className="px-6 text-center">
									Ya tienes una cuenta?{" "}
									<Link href="/login">Iniciar sesión</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
