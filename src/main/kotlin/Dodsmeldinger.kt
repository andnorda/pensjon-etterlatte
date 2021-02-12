package no.pensjon

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.LoggerFactory

class Dodsmeldinger(val config:AppConfig) {

    val producer = KafkaProducer<String, String>(config.aivenproducerConfig())
    val logger = LoggerFactory.getLogger(this.javaClass)

    init {
        Runtime.getRuntime().addShutdownHook(Thread{ producer?.close()})

    }

    fun personErDod(ident:String){
        logger.info("Poster at person $ident er død")
        producer.send(ProducerRecord("dodsmelding", ident, "fyren daua"))
    }

}