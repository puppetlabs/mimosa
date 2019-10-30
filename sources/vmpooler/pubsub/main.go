package main

import (
	"context"
	"log"
	"os"

	"github.com/puppetlabs/mimosa/sources/vmpooler"

	"cloud.google.com/go/pubsub"
)

func main() {

	//check that GOOGLE_APPLICATION_CREDENTIALS is set as this (json file) will be used to create a new storage.NewClient(ctx)
	//the project_id is configured in the json file, see: https://cloud.google.com/docs/authentication/getting-started
	value := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	if len(value) == 0 {
		log.Fatal("GOOGLE_APPLICATION_CREDENTIALS environment variable must be set")
	}

	project := os.Getenv("MIMOSA_GCP_PROJECT")
	if len(project) == 0 {
		log.Fatal("MIMOSA_GCP_PROJECT environment variable must be set")
	}

	subscription := os.Getenv("MIMOSA_GCP_SUBSCRIPTION")
	if len(subscription) == 0 {
		log.Fatal("MIMOSA_GCP_SUBSCRIPTION environment variable must be set")
	}

	ctx := context.Background()
	client, err := pubsub.NewClient(ctx, project)
	if err != nil {
		log.Fatalf("failed to create pubsub client: %v", err)
	}
	sub := client.Subscription(subscription)
	if err != nil {
		log.Fatalf("failed to get pubsub subscription: %v", err)
	}
	log.Printf("Ready for messages ...")
	err = sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
		msg.Ack()
		log.Printf("Got message: %s %q", string(msg.ID), string(msg.Data))
		err := vmpooler.HandleMessage(ctx, msg)
		if err != nil {
			log.Fatalf("failed to handle message: %v", err)
		}
	})
	if err != nil {
		log.Fatalf("failed to get start receiving messages: %v", err)
	}
	log.Printf("Exiting ...")

}