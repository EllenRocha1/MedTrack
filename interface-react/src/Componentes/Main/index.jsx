import Botao from '../Botao';
import imginicial from "../../Imagens/imginicial.png";
import { motion } from 'framer-motion';
import { FaBell, FaChartLine, FaUserMd, FaCalendarAlt, FaQuestionCircle, FaCheckCircle, FaMobileAlt, FaHeartbeat } from "react-icons/fa";
import Header from "../Header";

const Main = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Adicionando o Header no topo da página */}
            <Header
                h1="MedTrack"
                exibirPesquisa={false}
                setTermoPesquisa={() => {
                }}
            />
            <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 mx-auto mt-6 sm:mt-10">

                <div
                    className="flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 sm:p-10 shadow-lg">
                    {/* Text Section */}
                    <section className="w-full lg:w-1/2 order-2 lg:order-1">
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8}}
                        >
                            Gerencie suas medicações com facilidade!
                        </motion.h1>

                        <motion.p
                            className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-700"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.2}}
                        >
                            O <span className="font-semibold text-purple-600">MedTrack</span> é uma plataforma que
                            organiza suas medicações e notifica você na hora certa. Mantenha sua saúde em dia com um
                            sistema simples e eficiente.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.4}}
                        >
                            <Botao
                                label="Cadastre-se Gratis"
                                destino="/cadastro"
                                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
                            />
                            <Botao
                                label="Login"
                                destino="/login"
                                className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all"
                            />
                        </motion.div>
                    </section>

                    {/* Image Section */}
                    <section className="w-full lg:w-1/2 order-1 lg:order-2">
                        <motion.div
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.8, delay: 0.6}}
                        >
                            <img
                                src={imginicial}
                                alt="Lembrete de Medicação"
                                className="w-full max-w-[500px] lg:max-w-[600px] mx-auto drop-shadow-2xl"
                            />
                        </motion.div>
                    </section>
                </div>

                {/* Features Section */}
                <section className="mt-16 w-full max-w-6xl mx-auto">
                    <motion.h2
                        className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800"
                        initial={{opacity: 0}}
                        whileInView={{opacity: 1}}
                        transition={{duration: 0.5}}
                    >
                        Recursos Incríveis
                    </motion.h2>
                    <motion.p
                        className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto"
                        initial={{opacity: 0}}
                        whileInView={{opacity: 1}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        Tudo que você precisa para gerenciar sua saúde de forma simples e eficiente
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <FaBell className="text-3xl text-purple-600"/>,
                                title: "Lembretes Inteligentes",
                                desc: "Notificações precisas no horário certo"
                            },
                            {
                                icon: <FaChartLine className="text-3xl text-blue-600"/>,
                                title: "Relatórios Detalhados",
                                desc: "Acompanhe sua adesão ao tratamento"
                            },
                            {
                                icon: <FaUserMd className="text-3xl text-green-600"/>,
                                title: "Acompanhamento Médico",
                                desc: "Compartilhe dados com seu médico"
                            },
                            {
                                icon: <FaCalendarAlt className="text-3xl text-orange-600"/>,
                                title: "Agenda Personalizada",
                                desc: "Organize múltiplos medicamentos"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: index * 0.1}}
                                whileHover={{y: -5}}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 p-3 bg-purple-50 rounded-full">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-20 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                            <FaQuestionCircle className="text-2xl"/>
                            Perguntas Frequentes
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {[
                            {
                                question: "Como o MedTrack me lembra de tomar os remédios?",
                                answer: "Nós enviamos notificações push no seu celular e e-mails de lembrete nos horários que você configurar. Você também pode ativar alertas sonoros."
                            },
                            {
                                question: "É possível adicionar múltiplos medicamentos?",
                                answer: "Sim! Você pode cadastrar quantos medicamentos precisar, com horários, dosagens e instruções específicas para cada um."
                            },
                            {
                                question: "Meus dados estão seguros?",
                                answer: "Absolutamente. Utilizamos criptografia de ponta a ponta e seguimos todas as regulamentações de proteção de dados de saúde."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="p-6 hover:bg-gray-50 transition-colors"
                                initial={{opacity: 0}}
                                whileInView={{opacity: 1}}
                                transition={{duration: 0.5, delay: index * 0.1}}
                            >
                                <details className="group">
                                    <summary className="flex justify-between items-center cursor-pointer">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">{item.question}</h3>
                                        <span
                                            className="text-purple-600 text-xl transition-transform group-hover:rotate-90">+</span>
                                    </summary>
                                    <p className="mt-3 text-gray-600">{item.answer}</p>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="mt-20 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3"
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            transition={{duration: 0.5}}
                        >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Por que escolher o MedTrack?
            </span>
                        </motion.h2>
                        <motion.p
                            className="text-lg text-gray-600 max-w-3xl mx-auto"
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            transition={{duration: 0.5, delay: 0.2}}
                        >
                            A solução completa para o gerenciamento da sua saúde
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-md border border-gray-200"
                            initial={{opacity: 0, x: -20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6}}
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FaCheckCircle className="text-blue-600 text-2xl"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Precisão nos Horários</h3>
                                    <p className="text-gray-600">Nossa tecnologia garante que você receba os lembretes
                                        exatamente quando precisa, com tolerância zero para atrasos.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-md border border-gray-200"
                            initial={{opacity: 0, x: 20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <FaMobileAlt className="text-purple-600 text-2xl"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Multiplataforma</h3>
                                    <p className="text-gray-600">Acesse de qualquer dispositivo, sincronizado em tempo
                                        real. Disponível para iOS, Android e navegadores.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-md border border-gray-200"
                            initial={{opacity: 0, x: -20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FaHeartbeat className="text-green-600 text-2xl"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Saúde Integrada</h3>
                                    <p className="text-gray-600">Conecte-se com seu médico e compartilhe relatórios
                                        detalhados do seu tratamento.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl shadow-md border border-gray-200"
                            initial={{opacity: 0, x: 20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.6}}
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-pink-100 p-3 rounded-full">
                                    <FaUserMd className="text-pink-600 text-2xl"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Suporte Especializado</h3>
                                    <p className="text-gray-600">Nossa equipe de saúde está disponível para tirar
                                        dúvidas sobre seus medicamentos.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl"
                    initial={{opacity: 0, scale: 0.95}}
                    whileInView={{opacity: 1, scale: 1}}
                    transition={{duration: 0.6}}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pronto para transformar sua rotina de
                        saúde?</h2>
                    <p className="text-lg sm:text-xl mb-6 max-w-2xl mx-auto opacity-90">Cadastre-se agora e experimente
                        gratuitamente por 30 dias</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Botao
                            label="Comece Agora"
                            destino="/cadastro"
                            className="bg-white text-purple-600 hover:bg-gray-100 py-3 px-8 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                        />
                        <Botao
                            label="Saiba Mais"
                            destino="/sobre"
                            className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 py-3 px-8 rounded-full text-lg font-semibold shadow-md transform hover:scale-105 transition-all"
                        />
                    </div>
                </motion.section>
            </div></div>
            );
            };

            export default Main;