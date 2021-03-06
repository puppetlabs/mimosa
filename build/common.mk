
LINTER=$(shell go env GOPATH)/bin/golangci-lint

PHONY+= all
all: test tidy format lint
	@echo "✅ Finished (`date '+%H:%M:%S'`)"

PHONY+= test
test:
	@echo "🔘 Running tests ... (`date '+%H:%M:%S'`)"
	@go test ./...
	@echo "✅ Tests passed (`date '+%H:%M:%S'`)"

# Run go mod tidy and check go.sum is unchanged
PHONY+= tidy
tidy:
	@echo "🔘 Checking that go mod tidy does not make a change ... (`date '+%H:%M:%S'`)"
	@cp go.sum go.sum.bak
	@go mod tidy
	@diff go.sum go.sum.bak || (echo "🔴 go mod tidy would make a change, exiting"; exit 1)
	@rm go.sum.bak
	@echo "✅ Checking go mod tidy complete (`date '+%H:%M:%S'`)"

# Format go code and error if any changes are made
PHONY+= format
format:
	@echo "🔘 Checking that go fmt does not make any changes ... (`date '+%H:%M:%S'`)"
	@test -z $$(go fmt ./...) || (echo "🔴 go fmt would make a change, exiting"; exit 1)
	@echo "✅ Checking go fmt complete (`date '+%H:%M:%S'`)"

# Linting - depends on golangci-lint which can be installed like this:
# GO111MODULE=off go get github.com/golangci/golangci-lint/cmd/golangci-lint
PHONY+= lint
lint:
	@echo "🔘 Linting ... (`date '+%H:%M:%S'`)"
	@${LINTER} run
	@echo "✅ No lint errors found (`date '+%H:%M:%S'`)"
