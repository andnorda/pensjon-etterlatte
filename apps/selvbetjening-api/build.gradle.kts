plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(project(":libs:common"))
    implementation(project(":libs:ktorclient-auth-clientcredentials"))

    implementation(Ktor.OkHttp)
    implementation(Ktor.ServerCore)
    implementation(Ktor.ServerCio)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientJackson)
    implementation(Ktor.ClientCioJvm)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientLogging)
    implementation(Ktor.Jackson)
    implementation(Ktor.Auth)

    implementation(Jackson.DatatypeJsr310)
    implementation(Jackson.DatatypeJdk8)
    implementation(Jackson.ModuleKotlin)

    implementation(NavFelles.TokenClientCore)
    implementation(NavFelles.TokenValidationKtor)

    testImplementation(project(":libs:common-test"))
    testImplementation(MockK.MockK)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(Ktor.ClientMock)
    testImplementation(Ktor.ServerTests)
    testImplementation(Kotlinx.CoroutinesCore)
    testImplementation(NavFelles.MockOauth2Server)
}
